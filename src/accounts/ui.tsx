import ReactDOM from 'react-dom/client'
import {
	cbToPromise,
	extension,
	PortStream,
	setupDnode,
	transformMethods,
} from '../lib'
import { createAccountsStore } from './store'
import backgroundService, {
	BackgroundGetStateResult,
	BackgroundUiApi,
} from '../ui/services/Background'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { routes } from './routes'
import { createUpdateState } from './updateState'
import { Provider } from 'react-redux'
import '../ui/main.css'

startUi()

async function startUi() {
	const store = createAccountsStore()

	const updateState = createUpdateState(store)

	extension.storage.onChanged.addListener(async (changes, area) => {
		if (area !== 'local') {
			return
		}

		const stateChanges: Partial<Record<string, unknown>> &
			Partial<BackgroundGetStateResult> = await backgroundService.getState([
			'isInitialized',
			'isLocked',
		])

		for (const key in changes) {
			stateChanges[key] = changes[key].newValue
		}

		updateState(stateChanges)
	})

	const emitterApi = {
		closePopupWindow: async () => {
			const popup = extension.extension
				.getViews({ type: 'popup' })
				.find(w => w.location.pathname === '/popup.html')

			if (popup) {
				popup.close()
			}
		},
	}

	const connect = async () => {
		const port = extension.runtime.connect()

		port.onDisconnect.addListener(() => {
			backgroundService.setConnect(async () => {
				const newBackground = await connect()
				backgroundService.init(newBackground)
			})
		})

		const connectionStream = new PortStream(port)
		const dnode = setupDnode(connectionStream, emitterApi, 'api')

		return await new Promise<BackgroundUiApi>(resolve => {
			dnode.once('remote', (background: Record<string, unknown>) => {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any---
				resolve(transformMethods(cbToPromise, background) as any)
			})
		})
	}

	const background = await connect()

	const [state, networks] = await Promise.all([
		background.getState(),
		background.getNetworks(),
	])

	updateState({ ...state, networks })

	backgroundService.init(background)

	document.addEventListener('mousemove', () => backgroundService.updateIdle())
	document.addEventListener('keyup', () => backgroundService.updateIdle())
	document.addEventListener('mousedown', () => backgroundService.updateIdle())
	document.addEventListener('focus', () => backgroundService.updateIdle())

	const pageFromHash = window.location.hash.split('#')[1]

	const router = createMemoryRouter(routes, {
		initialEntries: [pageFromHash || '/'],
	})

	const root = ReactDOM.createRoot(
		document.getElementById('accounts') as HTMLElement
	)

	root.render(
		<Provider store={store}>
			<RouterProvider router={router} />
		</Provider>
	)
}
