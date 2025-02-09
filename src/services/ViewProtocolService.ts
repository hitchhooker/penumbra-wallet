import { ClientController, Transaction } from '../controllers'
import { ExtensionStorage } from '../storage'
import { IAsset } from '../types/asset'
import { IndexedDb } from '../utils'
import { decode_transaction } from 'penumbra-wasm'
import {
	AssetsRequest,
	AssetsResponse,
	BalanceByAddressRequest,
	BalanceByAddressResponse,
	ChainParametersRequest,
	ChainParametersResponse,
	FMDParametersRequest,
	FMDParametersResponse,
	NoteByCommitmentRequest,
	NoteByCommitmentResponse,
	NotesRequest,
	NotesResponse,
	StatusRequest,
	StatusResponse,
	StatusStreamRequest,
	StatusStreamResponse,
	TransactionByHashRequest,
	TransactionByHashResponse,
	TransactionHashesRequest,
	TransactionHashesResponse,
	TransactionsRequest,
	WitnessRequest,
	WitnessResponse,
} from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb'

import { FmdParameters } from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/chain/v1alpha1/chain_pb'
import {
	ASSET_TABLE_NAME,
	CHAIN_PARAMETERS_TABLE_NAME,
	FMD_PARAMETERS_TABLE_NAME,
	SPENDABLE_NOTES_TABLE_NAME,
	TRANSACTION_TABLE_NAME,
} from '../lib'

const areEqual = (first, second) =>
	first.length === second.length &&
	first.every((value, index) => value === second[index])

export class ViewProtocolService {
	private indexedDb
	private extensionStorage
	private getLastExistBlock

	constructor({
		indexedDb,
		extensionStorage,
		getLastExistBlock,
	}: {
		indexedDb: IndexedDb
		extensionStorage: ExtensionStorage
		getLastExistBlock: ClientController['getLastExistBlock']
	}) {
		this.indexedDb = indexedDb
		this.extensionStorage = extensionStorage
		this.getLastExistBlock = getLastExistBlock
	}

	async getBalanceByAddress(
		request?: BalanceByAddressRequest
	): Promise<BalanceByAddressResponse[]> {
		const { balance } = await this.extensionStorage.getState('balance')
		const assets: IAsset[] = await this.indexedDb.getAllValue(ASSET_TABLE_NAME)

		const res = Object.entries(balance).map((i: [string, number]) => {
			return new BalanceByAddressResponse().fromJson({
				amount: {
					lo: i[1],
					//TODO add hi
					// hi:
				},
				asset: {
					inner: assets.find(asset => asset.id.inner === i[0]).id.inner,
				},
			})
		})
		return res
	}

	async getStatus(request?: StatusRequest): Promise<StatusResponse> {
		const { lastSavedBlock } = await this.extensionStorage.getState(
			'lastSavedBlock'
		)
		const lasBlock = await this.getLastExistBlock()
		return new StatusResponse().fromJson({
			syncHeight: lastSavedBlock.testnet,
			catchingUp: lastSavedBlock.testnet === lasBlock,
		})
	}

	async getStatusStream(
		request?: StatusStreamRequest
	): Promise<StatusStreamResponse> {
		const { lastSavedBlock } = await this.extensionStorage.getState(
			'lastSavedBlock'
		)
		const lasBlock = await this.getLastExistBlock()

		return new StatusStreamResponse().fromJson({
			syncHeight: lastSavedBlock.testnet,
			latestKnownBlockHeight: lasBlock,
		})
	}

	async getAssets(request?: AssetsRequest): Promise<AssetsResponse[]> {
		const assets = await this.indexedDb.getAllValue(ASSET_TABLE_NAME)

		const response = assets.map(i => {
			return new AssetsResponse().fromJson({ asset: i })
		})

		return response
	}

	async getChainParameters(
		request?: ChainParametersRequest
	): Promise<ChainParametersResponse> {
		const chainParameters = await this.indexedDb.getAllValue(
			CHAIN_PARAMETERS_TABLE_NAME
		)
		const response = new ChainParametersResponse().fromJson({
			parameters: chainParameters[0],
		})
		return response
	}

	async getNotes(request?: NotesRequest): Promise<NotesResponse[]> {
		const notes = await this.indexedDb.getAllValue(SPENDABLE_NOTES_TABLE_NAME)
		return notes.map(i => new NotesResponse().fromJson({ noteRecord: i }))
	}

	async getNoteByCommitment(request: object) {
		const decodeRequest = new NoteByCommitmentRequest().fromBinary(
			new Uint8Array(Object.values(request))
		)

		const notes = await this.indexedDb.getAllValue(SPENDABLE_NOTES_TABLE_NAME)

		const selectedNote = notes.find(i => {
			return areEqual(
				i.noteCommitment.inner,
				decodeRequest.noteCommitment.inner
			)
		})

		if (!selectedNote) {
			throw new Error('Note doesn`t exist')
		}
		return new NoteByCommitmentResponse({
			spendableNote: { ...selectedNote, noteCommitmentHex: undefined },
		}).toBinary()
	}

	async getTransactionHashes(request?: object) {
		const tx: Transaction[] = await this.indexedDb.getAllValue(
			TRANSACTION_TABLE_NAME
		)
		const decodeRequest = new TransactionHashesRequest().fromBinary(
			new Uint8Array(Object.values(request))
		)

		let data: Transaction[] = []
		if (decodeRequest.startHeight && decodeRequest.endHeight) {
			data = tx.filter(
				i =>
					i.blockHeight >= decodeRequest.startHeight &&
					i.blockHeight <= decodeRequest.endHeight
			)
		} else if (decodeRequest.startHeight && !decodeRequest.endHeight) {
			data = tx.filter(i => i.blockHeight >= decodeRequest.startHeight)
		} else {
			data = tx
		}

		return data.map(i => {
			return new TransactionHashesResponse({
				blockHeight: i.blockHeight,
				txHash: i.txHash,
			}).toBinary()
		})
	}

	async getTransactionByHash(request: object) {
		const tx: Transaction[] = await this.indexedDb.getAllValue(
			TRANSACTION_TABLE_NAME
		)

		const decodeRequest = new TransactionByHashRequest().fromBinary(
			new Uint8Array(Object.values(request))
		)

		const selectedTx = tx.find(t => areEqual(t.txHash, decodeRequest.txHash))

		if (!selectedTx) {
			throw new Error('Tx doesn`t exist')
		}

		const decodeTransaction = decode_transaction(selectedTx.txBytes)

		return new TransactionByHashResponse({
			tx: this.mapTransaction(decodeTransaction),
		}).toBinary()
	}

	async getTransactions(request?: object) {
		const tx: Transaction[] = await this.indexedDb.getAllValue(
			TRANSACTION_TABLE_NAME
		)
		const decodeRequest = request
			? new TransactionsRequest().fromBinary(
					new Uint8Array(Object.values(request))
			  )
			: ({} as TransactionsRequest)

		let data: Transaction[] = []
		if (decodeRequest.startHeight && decodeRequest.endHeight) {
			data = tx.filter(
				i =>
					i.blockHeight >= decodeRequest.startHeight &&
					i.blockHeight <= decodeRequest.endHeight
			)
		} else if (decodeRequest.startHeight && !decodeRequest.endHeight) {
			data = tx.filter(i => i.blockHeight >= decodeRequest.startHeight)
		} else {
			data = tx
		}

		return data.map(i => {
			return {
				blockHeight: i.blockHeight,
				txHash: i.txHash,
				tx: this.mapTransaction(decode_transaction(i.txBytes)),
			}
		})
	}

	async getFMDParameters(
		request?: FMDParametersRequest
	): Promise<FMDParametersResponse> {
		const fmd = await this.indexedDb.getAllValue(FMD_PARAMETERS_TABLE_NAME)

		return new FMDParametersResponse().fromJson({
			parameters: fmd[0],
		})
	}

	async getWitness(request?: WitnessRequest) {
		return new WitnessResponse({}).toBinary()
	}

	mapTransaction(decodeTransaction) {
		return {
			bindingSig: new TextEncoder().encode(decodeTransaction.binding_sig),
			anchor: {
				inner: new TextEncoder().encode(decodeTransaction.anchor),
			},
			body: {
				actions: decodeTransaction.body.actions.map(i => {
					return {
						action: {
							case: Object.keys(i.action)[0].toLowerCase(),
							value: {
								authSig: {
									inner: new TextEncoder().encode(
										(Object.values(i.action)[0] as any).auth_sig
									),
								},
								proof: new TextEncoder().encode(
									(Object.values(i.action)[0] as any).proof
								),
								body: {
									balanceCommitment: {
										inner: new TextEncoder().encode(
											(Object.values(i.action)[0] as any).body
												.balance_commitment
										),
									},
									nullifier: new TextEncoder().encode(
										(Object.values(i.action)[0] as any).body.nullifier
									),
									rk: new TextEncoder().encode(
										(Object.values(i.action)[0] as any).body.rk
									),
									wrappedMemoKey: new TextEncoder().encode(
										(Object.values(i.action)[0] as any).body.wrapped_memo_key
									),
									ovkWrappedKey: new TextEncoder().encode(
										(Object.values(i.action)[0] as any).body.ovk_wrapped_key
									),
									notePayload: {
										ephemeralKey: new TextEncoder().encode(
											(Object.values(i.action)[0] as any).body.note_payload
												?.ephemeral_key
										),
										encryptedNote: new TextEncoder().encode(
											(Object.values(i.action)[0] as any).body.note_payload
												?.encrypted_note
										),
										noteCommitment: {
											inner: new TextEncoder().encode(
												(Object.values(i.action)[0] as any).body.note_payload
													?.note_commitment
											),
										},
									},
								},
							},
						},
					}
				}),
				expiryHeight: BigInt(decodeTransaction.body.expiry_height),
				chainId: decodeTransaction.body.chain_id,
				fee: {
					assetId: {
						inner: new TextEncoder().encode(
							decodeTransaction.body.fee.asset_id
						),
					},
					amount: {
						lo: BigInt(decodeTransaction.body.fee.amount.lo),
						hi: BigInt(decodeTransaction.body.fee.amount.hi),
					},
				},
				fmdClues: decodeTransaction.body.fmd_clues.map(i => ({
					inner: new TextEncoder().encode(i),
				})),
				//wtf
				// encryptedMemo: decodeTransaction.body.encrypted_memo,
			},
		}
	}
}
