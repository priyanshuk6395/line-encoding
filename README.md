# Line Encoding Schemes Visualization

This project is an interactive tool to visualize various line encoding schemes, including AMI (with optional scrambling), NRZ-I, NRZ-L, Manchester, and Differential Manchester encoding. It provides a dynamic interface for users to input binary data, choose an encoding scheme, and see the resulting signal plotted in real time.

## Features

- Supports multiple encoding schemes:
  - NRZ-I
  - NRZ-L
  - Manchester
  - Differential Manchester
  - AMI with optional B8ZS or HDB3 scrambling
- Validates binary input to ensure correctness.
- Dynamic signal plotting using Chart.js.
- User-friendly interface with interactive prompts for AMI scrambling.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/line-encoding-visualization.git
   ```
2. Navigate to the project directory:
   ```bash
   cd line-encoding-visualization
   ```
3. Open the `index.html` file in your browser to run the application.

## Usage

1. Input a binary sequence in the provided text field. Ensure the sequence contains only `0`s and `1`s.
2. Select an encoding scheme from the dropdown menu.
3. Click "Submit" to see the plotted signal corresponding to the selected encoding scheme.
4. For AMI:
   - Choose whether to apply scrambling.
   - If scrambling is selected, specify the type (`B8ZS` or `HDB3`).

## File Structure

- **index.html**: The main HTML file containing the structure of the application.
- **styles.css**: CSS for styling the application.
- **script.js**: Contains all the JavaScript logic for encoding, plotting, and user interactions.
- **chart.js**: A JavaScript library used for plotting the signals.

## Encoding Details

### 1. Non-Return to Zero - Inverted (NRZ-I)
- Signal level inverts on a `1` bit.

### 2. Non-Return to Zero - Level (NRZ-L)
- High level for `1` and low level for `0`.

### 3. Manchester Encoding
- `1` is represented as a high-to-low transition.
- `0` is represented as a low-to-high transition.

### 4. Differential Manchester Encoding
- Transition at the beginning of a bit for `0`.
- No transition at the beginning of a bit for `1`.

### 5. Alternate Mark Inversion (AMI)
- `1` alternates between positive and negative levels.
- Scrambling (B8ZS, HDB3) replaces specific zero patterns to maintain signal integrity.

## Dependencies

- [Chart.js](https://www.chartjs.org/) for rendering the signal plots.
