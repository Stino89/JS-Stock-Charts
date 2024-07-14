// Function to get color based on stock symbol
function getColor(stock) {
    if (stock === "GME") {
        return 'rgba(61, 161, 61, 0.7)';
    }
    if (stock === "MSFT") {
        return 'rgba(209, 4, 25, 0.7)';
    }
    if (stock === "DIS") {
        return 'rgba(18, 4, 209, 0.7)';
    }
    if (stock === "BNTX") {
        return 'rgba(166, 43, 158, 0.7)';
    }
}

// Main function to fetch data and create charts
async function main() {
    // Selecting canvas elements from the DOM
    const timeChartCanvas = document.querySelector('#time-chart');
    const highestPriceChartCanvas = document.querySelector('#highest-price-chart');
    const averagePriceChartCanvas = document.querySelector('#average-price-chart');

    try {
        // Fetching data from API
        const response = await fetch(`https://api.twelvedata.com/time_series?symbol=GME,MSFT,DIS,BNTX&interval=1day&apikey=b2b0e11651294ee9a789558a1625b754`);
        const result = await response.json();

        // Destructure data
        const { GME, MSFT, DIS, BNTX } = result;
        const stocks = [GME, MSFT, DIS, BNTX];

        // Reverse values for each stock
        stocks.forEach(stock => stock.values.reverse());

        // Time Chart
        new Chart(timeChartCanvas.getContext('2d'), {
            type: 'line',
            data: {
                labels: stocks[0].values.map(value => value.datetime), // Labels from datetime values
                datasets: stocks.map(stock => ({
                    label: stock.meta.symbol, // Stock symbol as label
                    backgroundColor: getColor(stock.meta.symbol), // Color based on symbol
                    borderColor: getColor(stock.meta.symbol), // Border color based on symbol
                    data: stock.values.map(value => parseFloat(value.high)) // High values
                }))
            }
        });

        // High Chart
        new Chart(highestPriceChartCanvas.getContext('2d'), {
            type: 'bar',
            data: {
                labels: stocks.map(stock => stock.meta.symbol), // Labels from symbols
                datasets: [{
                    label: 'Highest',
                    backgroundColor: stocks.map(stock => getColor(stock.meta.symbol)), // Colors based on symbols
                    borderColor: stocks.map(stock => getColor(stock.meta.symbol)), // Border colors based on symbols
                    data: stocks.map(stock => findHighest(stock.values)) // Highest values
                }]
            }
        });

        // Average Chart
        new Chart(averagePriceChartCanvas.getContext('2d'), {
            type: 'pie',
            data: {
                labels: stocks.map(stock => stock.meta.symbol), // Labels from symbols
                datasets: [{
                    label: 'Average',
                    backgroundColor: stocks.map(stock => getColor(stock.meta.symbol)), // Colors based on symbols
                    borderColor: stocks.map(stock => getColor(stock.meta.symbol)), // Border colors based on symbols
                    data: stocks.map(stock => calculateAverage(stock.values)) // Average values
                }]
            }
        });

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Function to find highest value in an array of values
function findHighest(values) {
    let highest = 0;
    values.forEach(value => {
        if (parseFloat(value.high) > highest) {
            highest = parseFloat(value.high);
        }
    });
    return highest;
}

// Function to calculate average value in an array of values
function calculateAverage(values) {
    let total = 0;
    values.forEach(value => {
        total += parseFloat(value.high);
    });
    return total / values.length;
}

// Call main function to start fetching data and creating charts
main();
