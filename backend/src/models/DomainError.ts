type Code =
	| 'invalid-credentials'
	| 'internal-error'
	| 'validation-error'
	| 'malformed-input'
	| 'not-found'
	| 'conflict-error'
	| 'authentication-required'
	| 'bad-request';
const internalErrorCodes: Array<Code> = ['internal-error'];

export default class DomainError extends Error {
	#isInternal: boolean;
	constructor(
		public code: Code,
		public details: undefined | { [key: string]: unknown } = undefined,
	) {
		super(code);
		this.#isInternal = internalErrorCodes.includes(code);
	}

	get isInternal() {
		return this.#isInternal;
	}
}
