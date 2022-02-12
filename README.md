# Scriptable DevOps Monitoring Widget

A [scriptable](https://scriptable.app/) widget for monitoring your services/websites that gives you peace-of-mind 🧘🏻‍♂️.

<img src="preview.png" width="300px">

## Usage

1. Download `script.js` to you iCloud _scriptable_ directory. It will be synced onto your device.
2. Add your services and tests to the top of the file.
3. Add a small _scriptable_ widget to your home screen. See _scriptable_ docs, if help is needed.

### How to add your services

```
const services = [
    {
        name: "my-service",
        path: "https://example.com/api",
        type: "json",
        test: (body) => true
    }
];
```

| property | required | description                                                                                                  |
| -------- | -------- | ------------------------------------------------------------------------------------------------------------ |
| name     | yes      | Display name of your service/site                                                                            |
| path     | yes      | Url of endpoint to check                                                                                     |
| type     |          | Tells the script how to parse the response for you: `undefined` (not at all), `json`, `string`, `statusCode` |
| test     | yes      | A function to test your API. Gets the response as a parameter. Must return `true`/`false`                    |

### Advanved options

You can use advanved options to modify the request:

```
const services = [
    {
        ...
        options: {
            headers: {},
            allowInsecureRequest: true,
        }
    }
];
```

| property             | required | description                                     |
| -------------------- | -------- | ----------------------------------------------- |
| headers              |          | Add request headers `{string: string}`          |
| allowInsecureRequest |          | Skip certificate checks (for self-signed certs) |
