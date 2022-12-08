import { authProviders, configureWunderGraphApplication, cors, introspect, templates } from '@wundergraph/sdk';
import server from './wundergraph.server';
import operations from './wundergraph.operations';

const spaceX = introspect.graphql({
	apiNamespace: 'spacex',
	url: 'https://spacex-api.fly.dev/graphql/',
});

// configureWunderGraph emits the configuration
configureWunderGraphApplication({
	apis: [spaceX],
	server,
	operations,
	codeGenerators: [
		{
			templates: [...templates.typescript.all],
			path: './generated',
		},
		{
			templates: [templates.typescript.client],
			path: '../components/generated',
		},
	],
	cors: {
		...cors.allowAll,
		allowedOrigins: ['http://localhost:5173'],
	},
	authentication: {
		cookieBased: {
			providers: [authProviders.demo()],
			authorizedRedirectUriRegexes: ['http://localhost:5173*'],
		},
	},
	security: {
		enableGraphQLEndpoint: process.env.NODE_ENV !== 'production',
	},
});