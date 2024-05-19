# Simple Logging [![@made-simple/logging](https://github.com/npm-made-simple/logging/actions/workflows/publish.yml/badge.svg)](https://github.com/npm-made-simple/logging/actions/workflows/publish.yml)

---

Logging with built-in timestamps and directly exporting chalk for formatting. Made to merge timestamps, logging, and chalk into one simple import.

## Installation

```bash
npm install @made-simple/logging
```

## Example Usage

```javascript
const logger = require('@made-simple/logging');

logger.log('This is a console log with a timestamp.');
logger.log(false, 'This is a console log without a timestamp.');
logger.error('This is a console error with a timestamp.');
logger.error(false, `This is a console ${logger.red('error')} without a timestamp and red text.`);
// etc.
```

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change. [Repository](https://github.cmo/npm-made-simple/logging)

## Contributors

[@alexasterisk](https://github.com/alexasterisk)
