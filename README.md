# Radio DPPST

A modern and lightweight web radio player for streaming various radio stations.

## Features

- Clean and responsive user interface
- Icecast/Shoutcast stream support
- Real-time metadata retrieval
- Automatic light/dark theme
- Volume control
- Automatic reconnection handling

## Technologies Used

- HTML5 Audio API
- Vanilla JavaScript
- CSS3 with theme variables
- Custom Icecast Metadata Player library

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
└── doc/               # Documentation
    ├── ameliorations.md
    └── proxy.md
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
