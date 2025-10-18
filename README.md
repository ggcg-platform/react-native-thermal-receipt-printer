# choiceqr-react-native-thermal-printer

A React Native Library to support USB/BLE/Net thermal receipt printers.

## Credits & Attribution

This project is a fork of [karaushu/react-native-thermal-receipt-printer](https://github.com/karaushu/react-native-thermal-receipt-printer), which itself is a fork of the original [react-native-thermal-receipt-printer](https://www.npmjs.com/package/react-native-thermal-receipt-printer).

### Fork History

- **Original**: `react-native-thermal-receipt-printer` - Base thermal printer library
- **Fork by karaushu**: Added USB auto-connect functionality
- **This fork (ggcg-platform)**: Added QR code printing support

### What's New in This Fork

- ✅ **QR Code Printing** - `printQrCode()` method for USB/BLE/Net printers
- ✅ **Promise Support** - Better async/await support for BLE printer methods
- ✅ **Updated Documentation** - Comprehensive examples and API documentation

Special thanks to [karaushu](https://github.com/karaushu) for the USB auto-connect implementation and all previous contributors.

## Installation

### Install from GitHub (Recommended)

```bash
npm install https://github.com/ggcg-platform/react-native-thermal-receipt-printer.git

# Or with yarn
yarn add https://github.com/ggcg-platform/react-native-thermal-receipt-printer.git
```

### iOS Setup

```bash
cd ios && pod install && cd ..
```

## Troubleshoot

- when install in `react-native` version >= 0.60, xcode show this error

```
duplicate symbols for architecture x86_64
```

that because the .a library uses [CocoaAsyncSocket](https://github.com/robbiehanson/CocoaAsyncSocket) library and
Flipper uses it too

_Podfile_

```diff
...
  use_native_modules!

  # Enables Flipper.
  #
  # Note that if you have use_frameworks! enabled, Flipper will not work and
  # you should disable these next few lines.
  # add_flipper_pods!
  # post_install do |installer|
  #   flipper_post_install(installer)
  # end
...
```

and comment out code related to Flipper in `ios/AppDelegate.m`

## Support

| Printer    | Android            | IOS                |
| ---------- | ------------------ | ------------------ |
| USBPrinter | :heavy_check_mark: |                    |
| BLEPrinter | :heavy_check_mark: | :heavy_check_mark: |
| NetPrinter | :heavy_check_mark: | :heavy_check_mark: |

## Predefined tag

| Tags |      Description      |
| :--: | :-------------------: |
|  C   |        Center         |
|  D   |      Medium font      |
|  B   |      Large font       |
|  M   |      Medium font      |
|  CM  | Medium font, centered |
|  CB  | Medium font, centered |
|  CD  | Large font, centered  |

## Development workflow

To get started with the project, run `yarn bootstrap` in the root directory to install the required dependencies for
each package:

```sh
yarn bootstrap
```

## Usage

```javascript
import {
  USBPrinter,
  NetPrinter,
  BLEPrinter,
} from "choiceqr-react-native-thermal-printer";

USBPrinter.printText("<C>sample text</C>");
USBPrinter.printBill("<C>sample bill</C>");
USBPrinter.printQrCode("https://example.com");
```

### Available Methods

All printer types (USBPrinter, BLEPrinter, NetPrinter) support the following methods:

- `init()` - Initialize the printer
- `getDeviceList()` - Get list of available printers
- `connectPrinter()` - Connect to a specific printer
- `closeConn()` - Close the connection
- `printText(text, options)` - Print formatted text
- `printBill(text, options)` - Print a bill with default formatting
- `printRawData(data)` - Print raw bytes data
- `printImage(imagePath)` - Print an image
- `printQrCode(qrCode)` - Print a QR code (accepts any text string)

#### QR Code Printing

The `printQrCode` method accepts **any text string** as input and generates a QR code (250x250 pixels) centered on the receipt. You can pass:

- **URLs**: `"https://example.com"` or `"https://yourapp.com/order/12345"`
- **Plain text**: `"Hello World"` or `"Order #12345"`
- **JSON strings**: `'{"orderId": 123, "customer": "John"}'`
- **Numbers**: `"123456789"`
- **Any string data**: Up to QR code capacity limits (depends on data type, typically ~3000 alphanumeric characters)

## Example

### USBPrinter (only support android)

```typescript
interface IUSBPrinter {
  device_name: string;
  vendor_id: number;
  product_id: number;
}
```

```javascript
  const [printers, setPrinters] = useState([]);
const [currentPrinter, setCurrentPrinter] = useState();

useEffect = () => {
	if (Platform.OS == 'android') {
		USBPrinter.init().then(() => {
			//list printers
			USBPrinter.getDeviceList().then(setPrinters);
		})
	}
}

const _connectPrinter = (printer) => USBPrinter.connectPrinter(printer.vendorID, printer.productId).then(() => setCurrentPrinter(printer))

const printTextTest = () => {
	currentPrinter && USBPrinter.printText("<C>sample text</C>\n");
}

const printBillTest = () => {
	currentPrinter && USBPrinter.printBill("<C>sample bill</C>");
}

const printQrCodeTest = async () => {
	if (currentPrinter) {
		try {
			// Example 1: Print a URL
			await USBPrinter.printQrCode("https://example.com/order/12345");

			// Example 2: Print order/tracking number
			await USBPrinter.printQrCode("ORDER-2024-001234");

			// Example 3: Print structured data (JSON)
			const orderData = JSON.stringify({
				orderId: "12345",
				date: "2024-01-15",
				total: 99.99
			});
			await USBPrinter.printQrCode(orderData);

			console.log("QR Code printed successfully");
		} catch (error) {
			console.error("Print QR Code error:", error);
		}
	}
}

...

return (
	<View style={styles.container}>
		{
			printers.map(printer => (
				<TouchableOpacity key={printer.device_id} onPress={() => _connectPrinter(printer)}>
					{`device_name: ${printer.device_name}, device_id: ${printer.device_id}, vendor_id: ${printer.vendor_id}, product_id: ${printer.product_id}`}
				</TouchableOpacity>
			))
		}
		<TouchableOpacity onPress={printTextTest}>
			<Text>Print Text</Text>
		</TouchableOpacity>
		<TouchableOpacity onPress={printBillTest}>
			<Text>Print Bill Text</Text>
		</TouchableOpacity>
		<TouchableOpacity onPress={printQrCodeTest}>
			<Text>Print QR Code</Text>
		</TouchableOpacity>
	</View>
)

...

```

### BLEPrinter

```typescript
interface IBLEPrinter {
  device_name: string;
  inner_mac_address: string;
}
```

```javascript
  const [printers, setPrinters] = useState([]);
const [currentPrinter, setCurrentPrinter] = useState();

useEffect(() => {
	BLEPrinter.init().then(() => {
		BLEPrinter.getDeviceList().then(setPrinters);
	});
}, []);

_connectPrinter => (printer) => {
	//connect printer
	BLEPrinter.connectPrinter(printer.inner_mac_address).then(
		setCurrentPrinter,
		error => console.warn(error))
}

printTextTest = () => {
	currentPrinter && BLEPrinter.printText("<C>sample text</C>\n");
}

printBillTest = () => {
	currentPrinter && BLEPrinter.printBill("<C>sample bill</C>");
}

...

return (
	<View style={styles.container}>
		{
			this.state.printers.map(printer => (
				<TouchableOpacity key={printer.inner_mac_address} onPress={() => _connectPrinter(printer)}>
					{`device_name: ${printer.device_name}, inner_mac_address: ${printer.inner_mac_address}`}
				</TouchableOpacity>
			))
		}
		<TouchableOpacity onPress={printTextTest}>
			<Text>Print Text</Text>
		</TouchableOpacity>
		<TouchableOpacity onPress={printBillTest}>
			<Text>Print Bill Text</Text>
		</TouchableOpacity>
	</View>
)

...

```

### NetPrinter

```typescript
interface INetPrinter {
  device_name: string;
  host: string;
  port: number;
}
```

_Note:_ get list device for net printers is support scanning in local ip but not recommended

```javascript

componentDidMount = () => {
	NetPrinter.init().then(() => {
		this.setState(Object.assign({}, this.state, { printers: [{ host: '192.168.10.241', port: 9100 }] }))
	})
}

_connectPrinter => (host, port) => {
	//connect printer
	NetPrinter.connectPrinter(host, port).then(
		(printer) => this.setState(Object.assign({}, this.state, { currentPrinter: printer })),
		error => console.warn(error))
}

printTextTest = () => {
	if (this.state.currentPrinter) {
		NetPrinter.printText("<C>sample text</C>\n");
	}
}

printBillTest = () => {
	if (this.state.currentPrinter) {
		NetPrinter.printBill("<C>sample bill</C>");
	}
}

...

render()
{
	return (
		<View style={styles.container}>
			{
				this.state.printers.map(printer => (
					<TouchableOpacity key={printer.device_id}
														onPress={(printer) => this._connectPrinter(printer.host, printer.port)}>
						{`device_name: ${printer.device_name}, host: ${printer.host}, port: ${printer.port}`}
					</TouchableOpacity>
				))
			}
			<TouchableOpacity onPress={() => this.printTextTest()}>
				<Text>Print Text</Text>
			</TouchableOpacity>
			<TouchableOpacity onPress={() => this.printBillTest()}>
				<Text>Print Bill Text</Text>
			</TouchableOpacity>
		</View>
	)
}

```

### With Encoder

```ts
import EscPosEncoder from "esc-pos-encoder";
import { errors } from "@sideway/address";

const encoder = new EscPosEncoder();

const printBillTest = () => {
  const encoderResult = encoder
    .codepage("windows1251")
    .text("Iñtërnâtiônàlizætiøn")
    .codepage("cp737")
    .text("ξεσκεπάζω την ψυχοφθόρα βδελυγμία")
    .encode();
  BLEPrinter.printRawData(encoderResult, (error: Error) =>
    console.log("error callback: ", error)
  );
};
```

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC License - See package.json for details

## Acknowledgments

- **Original Library**: [react-native-thermal-receipt-printer](https://www.npmjs.com/package/react-native-thermal-receipt-printer)
- **karaushu**: USB auto-connect implementation
- **ggcg-platform**: QR code printing support
- All contributors to the original projects

## Support

If you encounter any issues or have questions:
- Open an issue on [GitHub](https://github.com/ggcg-platform/react-native-thermal-receipt-printer/issues)
- Check the [CHANGELOG](CHANGELOG.md) for recent updates

---

**Maintained by**: [ggcg-platform](https://github.com/ggcg-platform)
**Forked from**: [karaushu/react-native-thermal-receipt-printer](https://github.com/karaushu/react-native-thermal-receipt-printer)
