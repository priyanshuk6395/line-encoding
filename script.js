
document.getElementById("encodingForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission
    processData();
});
function processData() {
    const encoding = document.getElementById("encoding").value;
    const databits = document.getElementById("databits").value;

    if (!databits.match(/^[01]+$/)) {
        alert("Please enter a valid binary sequence.");
        return;
    }
    
    const bitsArray = databits.split('').map(bit => parseInt(bit));
    bitsArray.push(0);
    if (encoding === "ami") {
        askScrambling(bitsArray);  // Call this function if AMI is selected
    } else {
        const encodingData = encode(bitsArray, encoding);
        plotEncoding(encodingData, encoding);
    }

}

function askScrambling(bitsArray) {
    const scrambling = confirm("Do you want scrambling for AMI?");
    if (scrambling) {
        const scramblingType = prompt("Choose the type of scrambling (B8ZS or HDB3):");
        if (scramblingType.toUpperCase() === "B8ZS" || scramblingType.toUpperCase() === "HDB3") {
            const encodingData = amiEncode(bitsArray, scramblingType);
            plotEncoding(encodingData, `AMI with ${scramblingType}`);
        } else {
            alert("Invalid scrambling type. Please enter B8ZS or HDB3.");
        }
    } else {
        const encodingData = amiEncode(bitsArray, null);
        plotEncoding(encodingData, "AMI");
    }
}

function encode(data, encoding) {
    switch (encoding) {
        case "nrzI": return nrziEncode(data);
        case "nrzL": return nrzlEncode(data);
        case "manchester": return manchesterEncode(data);
        case "diffManchester": return diffManchesterEncode(data);
        case "ami": return amiEncode(data, null); // Default AMI without scrambling
        default:
            alert("Invalid encoding type");
            return [];
    }
}

// NRZ-I Encoding
function nrziEncode(data) {
    let signal = [];
    let currentLevel = 1; // Assume starting level is high
    for (let bit of data) {
        if (bit === 1) {
            currentLevel *= -1; // Invert level on '1'
        }
        signal.push(currentLevel);
    }
    return signal;
}

// NRZ-L Encoding
function nrzlEncode(data) {
    return data.map(bit => (bit === 1 ? 1 : -1));
}

// Manchester Encoding
function manchesterEncode(data) {
    let signal = [];
    for (let bit of data) {
        if (bit === 1) {
            signal.push(1, -1); // High-to-low transition for '1'
        } else {
            signal.push(-1, 1); // Low-to-high transition for '0'
        }
    }
    return signal;
}

// Differential Manchester Encoding
function diffManchesterEncode(data) {
    let signal = [];
    let currentLevel = -1; // Assume starting level is low
    for (let bit of data) {
        if (bit === 1) {
            signal.push(currentLevel, currentLevel * -1); // Transition at middle
        } else {
            currentLevel *= -1; // Flip level at beginning for '0'
            signal.push(currentLevel, currentLevel * -1);
        }
    }
    return signal;
}


// AMI Encoding
function amiEncode(data, scramblingType) {
    let signal = [];
    let lastPositive = false;  // Tracks the polarity of the last '1' bit (alternates between -1 and 1)
    let zeroCount = 0;  // Tracks consecutive zeros
    let onecount = 0;  // Tracks the number of '1' bits for HDB3 parity calculation

    // Helper function to determine the polarity of the violation bit
    function check(lastPositive, a, b) {
        let v = lastPositive ? a : b;
        if (a === -1) lastPositive = !lastPositive;  // Toggle polarity if the violation bit is -1
        return v;
    }

    for (let bit of data) {
        if (bit === 1) {
            // For '1' bits, alternate polarity (AMI rule)
            lastPositive = !lastPositive;
            signal.push(lastPositive ? 1 : -1);
            zeroCount = 0;  // Reset zero count when a '1' is encountered
            onecount++;  // Increment the count of '1' bits
        } else {
            zeroCount++;  // Count consecutive zeros

            if (scramblingType === "B8ZS" && zeroCount === 8) {
                // Apply B8ZS rule when 8 consecutive zeros are encountered
                // B8ZS rule: Replace 8 consecutive zeros with violation pattern 000VB0VB
                // where V is a violation bit that alternates in polarity

                // Remove the last 8 zeros
                while (zeroCount > 1) {
                    signal.pop();  // Remove the zeros
                    zeroCount--;
                }

                // Insert the B8ZS violation pattern (V = violation bit)
                signal.push(0, 0, 0, check(lastPositive, 1, -1), check(lastPositive, -1, 1), 0, check(lastPositive, -1, 1), check(lastPositive, 1, -1));

                // Reset zeroCount after applying B8ZS
                zeroCount = 0;
            } else if (scramblingType === "HDB3" && zeroCount === 4) {
                // Apply HDB3 rule when 4 consecutive zeros are encountered
                // Remove the last 4 zeros and insert a violation bit based on parity

                // Remove the last 4 zeros
                signal.pop();
                signal.pop();
                signal.pop();
                signal.pop();

                if (onecount % 2 === 0) {
                    // Even parity: Insert violation bit with alternating polarity
                    signal.push(check(lastPositive, -1, 1), 0, 0, check(lastPositive, -1, 1));
                } else {
                    // Odd parity: Insert violation bit with alternating polarity
                    signal.push(0, 0, 0, check(lastPositive, -1, 1));
                }

                // Increment the '1' bit count (2 new violation bits added)
                onecount += 2;

                // Reset zeroCount after applying HDB3
                zeroCount = 0;
            } else {
                // If no scrambling rule applies, just add a zero
                signal.push(0);
            }
        }
    }

    return signal;
}



// Helper function to plot the encoded data
function plotEncoding(data, title) {
    const ctx = document.getElementById("chart").getContext("2d");
    if (window.myChart) window.myChart.destroy();
    const labels = Array.from({ length: data.length }, (_, i) => i + 1); // X-axis labels
    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: title,
                data: data,
                borderColor: 'blue',
                backgroundColor: 'lightblue',
                fill: false,
                stepped: true,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: "Time" } },
                y: {
                    title: { display: true, text: "Signal Level" },
                    suggestedMin: -1.5,
                    suggestedMax: 1.5
                }
            }
        }
    });
}
