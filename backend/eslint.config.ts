import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import ts from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

export default defineConfig(js.configs.recommended, ...ts.configs.recommended, prettier, {
	languageOptions: {
		globals: globals.node,
	},
	rules: {
		'no-undef': 'off',
		'no-unused-vars': 'off',
		'no-case-declarations': 'off',
		'@typescript-eslint/no-explicit-any': 'warn',
		'prettier/prettier': 'warn',

		'@typescript-eslint/no-unused-vars': [
			'warn',
			{
				argsIgnorePattern: '^_',
				varsIgnorePattern: '^_',
				caughtErrorsIgnorePattern: '^_',
			},
		],
	},
});
