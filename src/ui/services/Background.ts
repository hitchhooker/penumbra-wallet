import { __BackgroundUiApiDirect } from '../../background'
import { Contact, NetworkName, PermissionType } from '../../controllers'
import { PreferencesAccount } from '../../preferences'
import { StorageLocalState } from '../../storage'
import {
	ParsedActions,
	TransactionPlan,
	TransactionResponseType,
} from '../../types/transaction'
import { TableName } from '../../utils'
import { CreateWalletInput, ISeedWalletInput } from '../../wallets'
import { PENUMBRAWALLET_DEBUG } from '../appConfig'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function prepareErrorMessage(err: any) {
	return err && err.message ? err.message : String(err)
}

export type BackgroundUiApi = __BackgroundUiApiDirect

class Background {
	static instance: Background
	//   background: BackgroundUiApi | undefined;
	background: any
	initPromise: Promise<void>
	updatedByUser = false
	_connect: () => void
	_defer: {
		resolve?: () => void
		reject?: () => void
		promise?: Promise<unknown>
	}
	_lastUpdateIdle = 0
	_tmr: ReturnType<typeof setTimeout> | undefined

	constructor() {
		this._connect = () => undefined
		this._defer = {}
		this.initPromise = new Promise((res, rej) => {
			this._defer.resolve = res
			this._defer.reject = rej
		})
		this._defer.promise = this.initPromise
	}

	init(background: BackgroundUiApi) {
		this.background = background
		this._connect = () => undefined
		// global access to service on debug
		if (PENUMBRAWALLET_DEBUG) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			;(global as any).background = background
		}
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		this._defer.resolve!()
	}

	setConnect(connect: () => void) {
		this._connect = connect
	}

	async getState<K extends keyof StorageLocalState>(params?: K[]) {
		try {
			await this.initPromise
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			await this._connect!()
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			return await this.background!.getState(params)
		} catch (err) {
			throw new Error(prepareErrorMessage(err))
		}
	}

	async updateIdle() {
		this.updatedByUser = true
		this._updateIdle()
	}

	async setIdleInterval(interval: number) {
		try {
			await this.initPromise
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			await this._connect!()
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			return await this.background!.setIdleInterval(interval)
		} catch (err) {
			throw new Error(prepareErrorMessage(err))
		}
	}

	//   async allowOrigin(origin: string) {
	//     try {
	//       await this.initPromise;
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       await this._connect!();
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       return await this.background!.allowOrigin(origin);
	//     } catch (err) {
	//       throw new Error(prepareErrorMessage(err));
	//     }
	//   }

	//   async disableOrigin(origin: string) {
	//     try {
	//       await this.initPromise;
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       await this._connect!();
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       return await this.background!.disableOrigin(origin);
	//     } catch (err) {
	//       throw new Error(prepareErrorMessage(err));
	//     }
	//   }

	async deleteOrigin(origin: string) {
		try {
			await this.initPromise
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			await this._connect!()
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			return await this.background!.deleteOrigin(origin)
		} catch (err) {
			throw new Error(prepareErrorMessage(err))
		}
	}

	async setPermission(origin: string, permission: PermissionType) {
		try {
			await this.initPromise
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			await this._connect!()
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			return await this.background!.setPermission(origin, permission)
		} catch (err) {
			throw new Error(prepareErrorMessage(err))
		}
	}

	async deletePermission(origin: string, permission: PermissionType) {
		try {
			await this.initPromise
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			await this._connect!()
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			return await this.background!.deletePermission(origin, permission)
		} catch (err) {
			throw new Error(prepareErrorMessage(err))
		}
	}

	//   async setAutoSign(
	//     origin: string,
	//     options: { interval: number; totalAmount: number }
	//   ) {
	//     try {
	//       await this.initPromise;
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       await this._connect!();
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-explicit-any
	//       return await (this.background!.setAutoSign as any)(origin, options);
	//     } catch (err) {
	//       throw new Error(prepareErrorMessage(err));
	//     }
	//   }

	//   async setNotificationPermissions(options: {
	//     origin: string;
	//     canUse: boolean;
	//   }) {
	//     try {
	//       await this.initPromise;
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       await this._connect!();
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       return await this.background!.setNotificationPermissions(options);
	//     } catch (err) {
	//       throw new Error(prepareErrorMessage(err));
	//     }
	//   }

	//   async setCurrentLocale(lng: string): Promise<void> {
	//     try {
	//       await this.initPromise;
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       await this._connect!();
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       return await this.background!.setCurrentLocale(lng);
	//     } catch (err) {
	//       throw new Error(prepareErrorMessage(err));
	//     }
	//   }

	//   async setUiState(newUiState: UiState) {
	//     try {
	//       await this.initPromise;
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       await this._connect!();
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       return await this.background!.setUiState(newUiState);
	//     } catch (err) {
	//       throw new Error(prepareErrorMessage(err));
	//     }
	//   }

	async selectAccount(lastAccount: ISeedWalletInput): Promise<void> {
		try {
			await this.initPromise
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			await this._connect!()
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			return await this.background!.selectAccount(lastAccount)
		} catch (err) {
			throw new Error(prepareErrorMessage(err))
		}
	}

	async addWallet(data: CreateWalletInput) {
		try {
			await this.initPromise
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			await this._connect!()
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			return await this.background!.addWallet(data)
		} catch (err) {
			console.error(err)
			throw new Error(prepareErrorMessage(err))
		}
	}

	//   async removeWallet(address: string, network: NetworkName): Promise<void> {
	//     try {
	//       await this.initPromise;
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       await this._connect!();
	//       if (address) {
	//         // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//         return await this.background!.removeWallet(address, network);
	//       }

	//       return await this.deleteVault();
	//     } catch (err) {
	//       throw new Error(prepareErrorMessage(err));
	//     }
	//   }

	//   async deleteVault() {
	//     try {
	//       await this.initPromise;
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       await this._connect!();
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       return await this.background!.deleteVault();
	//     } catch (err) {
	//       throw new Error(prepareErrorMessage(err));
	//     }
	//   }

	async closeNotificationWindow(): Promise<void> {
		try {
			await this.initPromise
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			await this._connect!()
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			return await this.background!.closeNotificationWindow()
		} catch (err) {
			throw new Error(prepareErrorMessage(err))
		}
	}

	async showTab(url: string, name: string): Promise<void> {
		try {
			await this.initPromise
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			await this._connect!()
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			return await this.background!.showTab(url, name)
		} catch (err) {
			throw new Error(prepareErrorMessage(err))
		}
	}

	//   async closeCurrentTab(): Promise<void> {
	//     try {
	//       await this.initPromise;
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       await this._connect!();
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       return await this.background!.closeCurrentTab();
	//     } catch (err) {
	//       throw new Error(prepareErrorMessage(err));
	//     }
	//   }

	async lock(): Promise<void> {
		try {
			await this.initPromise
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			await this._connect!()
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			return await this.background!.lock()
		} catch (err) {
			throw new Error(prepareErrorMessage(err))
		}
	}

	async resetWallet(): Promise<void> {
		try {
			await this.initPromise
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			await this._connect!()
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			return await this.background!.resetWallet()
		} catch (err) {
			throw new Error(prepareErrorMessage(err))
		}
	}

	async unlock(password: string): Promise<void> {
		try {
			await this.initPromise
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			await this._connect!()
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			return await this.background!.unlock(password)
		} catch (err) {
			throw new Error(prepareErrorMessage(err))
		}
	}

	async initVault(password: string): Promise<void> {
		try {
			await this.initPromise
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			await this._connect!()
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			return await this.background!.initVault(password)
		} catch (err) {
			throw new Error(prepareErrorMessage(err))
		}
	}

	//   async checkPassword(password: string): Promise<string> {
	//     try {
	//       await this.initPromise;
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       await this._connect!();
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-explicit-any
	//       return (await this.background!.checkPassword(password)) as any;
	//     } catch (err) {
	//       throw new Error(prepareErrorMessage(err));
	//     }
	//   }

	async getAccountSeed(password: string): Promise<string> {
		try {
			await this.initPromise
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			await this._connect!()
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			return await this.background!.getAccountSeed(password)
		} catch (err) {
			throw new Error(prepareErrorMessage(err))
		}
	}

	//   async getAccountEncodedSeed(
	//     address: string,
	//     network: NetworkName,
	//     password: string
	//   ): Promise<string> {
	//     try {
	//       await this.initPromise;
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       await this._connect!();
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       return await this.background!.getAccountEncodedSeed(
	//         address,
	//         network,
	//         password
	//       );
	//     } catch (err) {
	//       throw new Error(prepareErrorMessage(err));
	//     }
	//   }

	async getAccountFullViewingKey(password: string): Promise<string> {
		try {
			await this.initPromise
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			await this._connect!()
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			return await this.background!.getAccountFullViewingKey(password)
		} catch (err) {
			throw new Error(prepareErrorMessage(err))
		}
	}

	async getAccountSpendingKey(password: string): Promise<string> {
		try {
			await this.initPromise
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			await this._connect!()
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			return await this.background!.getAccountSpendingKey(password)
		} catch (err) {
			throw new Error(prepareErrorMessage(err))
		}
	}
	async getCompactBlockRange(): Promise<void> {
		try {
			await this.initPromise
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			await this._connect!()
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			return await this.background!.getCompactBlockRange()
		} catch (err) {
			throw new Error(prepareErrorMessage(err))
		}
	}

	async getTransactionPlan(
		destAddress: string,
		amount: number,
		assetId?: string
	): Promise<{
		transactionPlan: TransactionPlan
		actions: ParsedActions[]
	}> {
		try {
			await this.initPromise
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			await this._connect!()
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			return await this.background!.getTransactionPlan(
				destAddress,
				amount,
				assetId
			)
		} catch (err) {
			throw new Error(prepareErrorMessage(err))
		}
	}

	async parseActions(transactionPlan: TransactionPlan): Promise<{
		transactionPlan: TransactionPlan
		actions: ParsedActions[]
	}> {
		try {
			await this.initPromise
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			await this._connect!()
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			return await this.background!.parseActions(transactionPlan)
		} catch (err) {
			throw new Error(prepareErrorMessage(err))
		}
	}

	//parseActions

	async sendTransaction(
		sendPlan: TransactionPlan
	): Promise<TransactionResponseType> {
		try {
			await this.initPromise
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			await this._connect!()
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			return await this.background!.sendTransaction(sendPlan)
		} catch (err) {
			throw new Error(prepareErrorMessage(err))
		}
	}

	async getValueById(tableName: TableName, id: string) {
		try {
			await this.initPromise
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			await this._connect!()
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			return await this.background!.getValueById(tableName, id)
		} catch (err) {
			throw new Error(prepareErrorMessage(err))
		}
	}

	//   async editWalletName(address: string, name: string, network: NetworkName) {
	//     try {
	//       await this.initPromise;
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       await this._connect!();
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       return await this.background!.editWalletName(address, name, network);
	//     } catch (err) {
	//       throw new Error(prepareErrorMessage(err));
	//     }
	//   }

	//   async newPassword(oldPassword: string, newPassword: string): Promise<void> {
	//     try {
	//       await this.initPromise;
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       await this._connect!();
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       return await this.background!.newPassword(oldPassword, newPassword);
	//     } catch (err) {
	//       throw new Error(prepareErrorMessage(err));
	//     }
	//   }

	//   async clearMessages(): Promise<void> {
	//     try {
	//       await this.initPromise;
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       await this._connect!();
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       return await this.background!.clearMessages();
	//     } catch (err) {
	//       throw new Error(prepareErrorMessage(err));
	//     }
	//   }

	async deleteMessage(id: string): Promise<void> {
		try {
			await this.initPromise
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			await this._connect!()
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			return await this.background!.deleteMessage(id)
		} catch (err) {
			throw new Error(prepareErrorMessage(err))
		}
	}

	async approve(
		messageId: string,
	): Promise<unknown> {
		try {
			await this.initPromise
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			await this._connect!()
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			return await this.background!.approve(messageId)
		} catch (err) {
			throw new Error(prepareErrorMessage(err))
		}
	}

	async clearMessages(): Promise<void> {
		try {
			await this.initPromise
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			await this._connect!()
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			return await this.background!.clearMessages()
		} catch (err) {
			throw new Error(prepareErrorMessage(err))
		}
	}

	async reject(messageId: string, forever = false): Promise<void> {
		try {
			await this.initPromise
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			await this._connect!()
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			return await this.background!.reject(messageId, forever)
		} catch (err) {
			throw new Error(prepareErrorMessage(err))
		}
	}

	//   async updateTransactionFee(messageId: string, fee: IMoneyLike) {
	//     try {
	//       await this.initPromise;
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       await this._connect!();
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       return await this.background!.updateTransactionFee(messageId, fee);
	//     } catch (err) {
	//       throw new Error(prepareErrorMessage(err));
	//     }
	//   }

	//   async setNetwork(network: NetworkName): Promise<void> {
	//     try {
	//       await this.initPromise;
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       await this._connect!();
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       return await this.background!.setNetwork(network);
	//     } catch (err) {
	//       throw new Error(prepareErrorMessage(err));
	//     }
	//   }

	async setCustomGRPC(
		url: string | null | undefined,
		network: NetworkName
	): Promise<void> {
		try {
			await this.initPromise
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			await this._connect!()
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			return await this.background!.setCustomGRPC(url, network)
		} catch (err) {
			throw new Error(prepareErrorMessage(err))
		}
	}

	async setCustomTendermint(
		code: string | undefined,
		network: NetworkName
	): Promise<void> {
		try {
			await this.initPromise
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			await this._connect!()
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			return await this.background!.setCustomTendermint(code, network)
		} catch (err) {
			throw new Error(prepareErrorMessage(err))
		}
	}

	//   async setCustomMatcher(
	//     url: string | null | undefined,
	//     network: NetworkName
	//   ): Promise<void> {
	//     try {
	//       await this.initPromise;
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       await this._connect!();
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       return await this.background!.setCustomMatcher(url, network);
	//     } catch (err) {
	//       throw new Error(prepareErrorMessage(err));
	//     }
	//   }

	//   async assetInfo(assetId: string): Promise<AssetDetail> {
	//     try {
	//       await this.initPromise;
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       await this._connect!();
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       return await this.background!.assetInfo(assetId || 'WAVES');
	//     } catch (err) {
	//       throw new Error(prepareErrorMessage(err));
	//     }
	//   }

	//   async updateAssets(assetIds: string[]): Promise<AssetDetail> {
	//     try {
	//       await this.initPromise;
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       await this._connect!();
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-explicit-any
	//       return (await this.background!.updateAssets(assetIds)) as any;
	//     } catch (err) {
	//       throw new Error(prepareErrorMessage(err));
	//     }
	//   }

	async setContact(contact: Contact): Promise<void> {
		try {
			await this.initPromise
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			await this._connect!()
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			return await this.background!.setContact(contact)
		} catch (err) {
			throw new Error(prepareErrorMessage(err))
		}
	}

	async updateContact(contact: Contact, prevAddress: string): Promise<void> {
		try {
			await this.initPromise
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			await this._connect!()
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			return await this.background!.updateContact(contact, prevAddress)
		} catch (err) {
			throw new Error(prepareErrorMessage(err))
		}
	}

	async removeContact(address: string): Promise<void> {
		try {
			await this.initPromise
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			await this._connect!()
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			return await this.background!.removeContact(address)
		} catch (err) {
			throw new Error(prepareErrorMessage(err))
		}
	}

	//   async toggleAssetFavorite(assetId: string): Promise<void> {
	//     try {
	//       await this.initPromise;
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       await this._connect!();
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       return await this.background!.toggleAssetFavorite(assetId);
	//     } catch (err) {
	//       throw new Error(prepareErrorMessage(err));
	//     }
	//   }

	//   async deleteNotifications(ids: string[]) {
	//     try {
	//       await this.initPromise;
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       await this._connect!();
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       return await this.background!.deleteNotifications(ids);
	//     } catch (err) {
	//       throw new Error(prepareErrorMessage(err));
	//     }
	//   }

	//   sendEvent(event: 'addWallet', properties: { type: string }): Promise<void>;
	//   sendEvent(event: 'click', properties: { id: string }): Promise<void>;
	//   sendEvent(
	//     event: 'swapAssets',
	//     properties: {
	//       actualAmountCoins?: string;
	//       expectedAmountCoins?: string;
	//       expectedActualDelta?: string;
	//       fromAssetId: string;
	//       fromCoins: string;
	//       minReceivedCoins: string;
	//       slippageTolerance: number;
	//       status: 'success' | 'lessThanExpected';
	//       toAssetId: string;
	//       toCoins: string;
	//     //   vendor: SwapVendor;
	//     }
	//   ): Promise<void>;
	//   async sendEvent(event: string, properties: Record<string, unknown> = {}) {
	//     try {
	//       await this.initPromise;
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       await this._connect!();
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       return await this.background!.sendEvent(event, properties);
	//     } catch (err) {
	//       throw new Error(prepareErrorMessage(err));
	//     }
	//   }

	//   async updateBalances() {
	//     try {
	//       await this.initPromise;
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       await this._connect!();
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       return await this.background!.updateBalances();
	//     } catch (err) {
	//       throw new Error(prepareErrorMessage(err));
	//     }
	//   }

	//   async swapAssets(params: SwapAssetsParams): Promise<SwapAssetsResult> {
	//     try {
	//       await this.initPromise;
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       await this._connect!();
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       return await this.background!.swapAssets(params);
	//     } catch (err) {
	//       throw new Error(prepareErrorMessage(err));
	//     }
	//   }

	//   async signAndPublishTransaction(
	//     data: MessageInputOfType<'transaction'>['data']
	//   ) {
	//     try {
	//       await this.initPromise;
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       await this._connect!();
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       return await this.background!.signAndPublishTransaction(data);
	//     } catch (err) {
	//       throw new Error(prepareErrorMessage(err));
	//     }
	//   }

	//   async getExtraFee(address: string, network: NetworkName) {
	//     try {
	//       await this.initPromise;
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       await this._connect!();
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       return await this.background!.getExtraFee(address, network);
	//     } catch (err) {
	//       throw new Error(prepareErrorMessage(err));
	//     }
	//   }

	//   async getMessageById(messageId: string) {
	//     try {
	//       await this.initPromise;
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       await this._connect!();
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       return await this.background!.getMessageById(messageId);
	//     } catch (err) {
	//       throw new Error(prepareErrorMessage(err));
	//     }
	//   }

	//   async shouldIgnoreError(context: IgnoreErrorsContext, message: string) {
	//     try {
	//       await this.initPromise;
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       await this._connect!();
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       return await this.background!.shouldIgnoreError(context, message);
	//     } catch (err) {
	//       throw new Error(prepareErrorMessage(err));
	//     }
	//   }

	//   async identityRestore(userId: string): Promise<void> {
	//     try {
	//       await this.initPromise;
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       await this._connect!();
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-explicit-any
	//       return (await this.background!.identityRestore(userId)) as any;
	//     } catch (err) {
	//       throw new Error(prepareErrorMessage(err));
	//     }
	//   }

	//   async identityUpdate(): Promise<void> {
	//     try {
	//       await this.initPromise;
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       await this._connect!();
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       return await this.background!.identityUpdate();
	//     } catch (err) {
	//       throw new Error(prepareErrorMessage(err));
	//     }
	//   }

	//   async identityClear(): Promise<void> {
	//     try {
	//       await this.initPromise;
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       await this._connect!();
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       return await this.background!.identityClear();
	//     } catch (err) {
	//       throw new Error(prepareErrorMessage(err));
	//     }
	//   }

	// //   async identitySignIn(
	// //     username: string,
	// //     password: string
	// //   ): Promise<
	// //     CognitoUser &
	// //       Partial<{ challengeName: AuthChallenge; challengeParam: unknown }>
	// //   > {
	// //     try {
	// //       await this.initPromise;
	// //       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	// //       await this._connect!();
	// //       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	// //       return await this.background!.identitySignIn(username, password);
	// //     } catch (err) {
	// //       throw new Error(prepareErrorMessage(err));
	// //     }
	// //   }

	//   async identityConfirmSignIn(code: string) {
	//     try {
	//       await this.initPromise;
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       await this._connect!();
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       return await this.background!.identityConfirmSignIn(code);
	//     } catch (err) {
	//       throw new Error(prepareErrorMessage(err));
	//     }
	//   }

	//   async identityUser(): Promise<IdentityUser> {
	//     try {
	//       await this.initPromise;
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       await this._connect!();
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-explicit-any
	//       return (await this.background!.identityUser()) as any;
	//     } catch (err) {
	//       throw new Error(prepareErrorMessage(err));
	//     }
	//   }

	//   async ledgerSignResponse(requestId: string, err: Error): Promise<void>;
	//   async ledgerSignResponse(
	//     requestId: string,
	//     err: null,
	//     signature: string
	//   ): Promise<void>;
	//   async ledgerSignResponse(
	//     requestId: string,
	//     err: Error | null,
	//     signature?: string
	//   ) {
	//     try {
	//       await this.initPromise;
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       await this._connect!();
	//       // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	//       return await this.background!.ledgerSignResponse(
	//         requestId,
	//         err && err.message ? err.message : null,
	//         signature
	//       );
	//     } catch (err) {
	//       throw new Error(prepareErrorMessage(err));
	//     }
	//   }

	async _updateIdle() {
		const now = Date.now()

		if (this._tmr != null) {
			clearTimeout(this._tmr)
		}

		this._tmr = setTimeout(() => this._updateIdle(), 4000)

		if (!this.updatedByUser || now - this._lastUpdateIdle < 4000) {
			return null
		}

		this.updatedByUser = false
		this._lastUpdateIdle = now
		await this.initPromise
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		await this._connect!()
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		return this.background!.updateIdle()
	}
}

export default new Background()

export enum WalletTypes {
	New = 'new',
	Seed = 'seed',
	EncodedSeed = 'encoded_seed',
	PrivateKey = 'private_key',
	Wx = 'wx',
	Ledger = 'ledger',
	Keystore = 'keystore',
	KeystoreWx = 'keystore_wx',
	Debug = 'debug',
}

export type BackgroundGetStateResult = Awaited<
	ReturnType<Background['getState']>
>
