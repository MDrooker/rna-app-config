# app-config

A library for loading application config from a local file or a remote source. Configuration
loaded can be overridden using environment variables;

# Basic Usage
```ts
type Config {
	name: string;
	version: string;
	nested: {
		name: string;
	};
};

AppConfig.load({
	filePath: './path/to/file-config.json',
	requiredVars: ['name', 'version'],
});

const config = AppConfig.get<Config>();

console.log(config);
/* output:
{
	name: 'foo',
	version: '0.0.1',
	nested: {
		name: 'alsoFoo'
	}
}
*/
```
