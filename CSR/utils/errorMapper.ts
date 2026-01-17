// CSR/utils/errorMapper.ts

import { UiError } from '../types/types';

export function mapHttpError(res: Response, body?: any): UiError {
	switch (res.status) {
		case 400:
			return {
				type: 'validation',
				message:
					body?.message ??
					'This action is not allowed for the current task status.',
			};
		case 404:
			return {
				type: 'not_found',
				message: 'This task no longer exists.',
			};
		case 500:
			return {
				type: 'unknown',
				message: 'Something went wrong on our side. Please try again.',
			};
		default:
			return {
				type: 'unknown',
				message: 'Unexpected error occurred.',
			};
	}
}
