# Radio DPPST

A modern and lightweight web radio player for streaming various radio stations.

## Features

- Clean and responsive user interface, adapting to different screen sizes.
- Supports Icecast and Shoutcast streaming protocols.
- Automatic light/dark theme based on user preferences or system settings.
- Volume control for adjusting the audio output.
- Automatic reconnection handling to maintain uninterrupted playback.
- Ability to add and modify radio stations via the `radios.json` file.

## Technologies Used

- HTML5 Audio API
- Vanilla JavaScript (ES6+)
- CSS3 with theme variables for styling and theming

## Installation

1. Clone the repository:
```bash
git clone https://github.com/toorop/radio.dppst.com.git
cd radio.dppst.com
```

2. Serve the files with your preferred web server or use a local development server.

## Usage

1. Open `index.html` in your browser
2. Select a radio station from the dropdown list
3. Use the playback controls to:
   - Start/stop playback
   - Adjust volume
   - View current track information

## Project Structure

```
radio.dppst.com/
├── index.html           # Main page
├── js/
│   ├── script.js       # Main logic
│   └── icecast-metadata-player.js  # Stream handler
├── styles.css          # Styles and themes
├── radio-logo.svg      # Radio station logo
├── radios.json         # Radio stations configuration
└── doc/               # Documentation
    ├── ameliorations.md # List of potential improvements, see [doc/improvements.md](doc/improvements.md)
    └── proxy.md
```

## radios.json

The `radios.json` file contains the configuration for the radio stations. You can add or modify radio stations by editing this file. The file should contain a JSON array of radio station objects, each with the following properties:

- `name`: The name of the radio station.
- `url`: The URL of the radio stream.
- `logo`: The URL of the radio station logo.

Example:

```json
[
  {
    "name": "Radio Station 1",
    "url": "http://example.com/stream1",
    "logo": "http://example.com/logo1.png"
  },
  {
    "name": "Radio Station 2",
    "url": "http://example.com/stream2",
    "logo": "http://example.com/logo2.png"
  }
]
```

## Development

### Prerequisites

- A modern web browser
- A text editor
- A local web server (optional)

### Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -am 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

- Stéphane Depierrepont (toorop@gmail.com)
