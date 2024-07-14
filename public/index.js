// index.js

// Load environment variables from .env file
require('dotenv').config();

// Function to get the color based on the stock symbol
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
    // Get API key from environment variables
    const apiKey = process.env.API_KEY;

    // Selecting the chart elements from the DOM
    const timeChartCanvas = document.querySelector('#time-chart');
    const highestPriceChartCanvas = document.querySelector('#highest-price-chart');
    const averagePriceChartCanvas = document.querySelector('#average-price-chart');

    // Fetching stock data from the API
    const response = await fetch(`https://api.twelvedata.com/time_series?symbol=GME,MSFT,DIS,BNTX&interval=1day&apikey=${apiKey}`);
    const result = await response.json();

    // Destructuring the result object to get individual stock data
    const { GME, MSFT, DIS, BNTX } = result;
    const stocks = [GME, MSFT, DIS, BNTX];

    // Reversing the order of values for each stock to have the latest data first
    stocks.forEach(stock => stock.values.reverse());

    // Creating the Time Chart
    new Chart(timeChartCanvas.getContext('2d'), {
        type: 'line',
        data: {
            labels: stocks[0].values.map(value => value.datetime), // Using datetime values as labels
            datasets: stocks.map(stock => ({
                label: stock.meta.symbol, // Stock symbol as the label
                backgroundColor: getColor(stock.meta.symbol), // Color based on stock symbol
                borderColor: getColor(stock.meta.symbol), // Border color based on stock symbol
                data: stock.values.map(value => parseFloat(value.high)) // High prices for the line chart
            }))
        }
    });

    // Creating the High Chart
    new Chart(highestPriceChartCanvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels: stocks.map(stock => stock.meta.symbol), // Stock symbols as labels
            datasets: [{
                label: 'Highest', // Dataset label
                backgroundColor: stocks.map(stock => getColor(stock.meta.symbol)), // Colors based on stock symbols
                borderColor: stocks.map(stock => getColor(stock.meta.symbol)), // Border colors based on stock symbols
                data: stocks.map(stock => findHighest(stock.values)) // Highest prices for each stock
            }]
        }
    });

    // Creating the Average Chart
    new Chart(averagePriceChartCanvas.getContext('2d'), {
        type: 'pie',
        data: {
            labels: stocks.map(stock => stock.meta.symbol), // Stock symbols as labels
            datasets: [{
                label: 'Average', // Dataset label
                backgroundColor: stocks.map(stock => getColor(stock.meta.symbol)), // Colors based on stock symbols
                borderColor: stocks.map(stock => getColor(stock.meta.symbol)), // Border colors based on stock symbols
                data: stocks.map(stock => calculateAverage(stock.values)) // Average prices for each stock
            }]
        }
    });
}

// Function to find the highest price in the given values
function findHighest(values) {
    let highest = 0;
    values.forEach(value => {
        if (parseFloat(value.high) > highest) {
            highest = value.high;
        }
    });
    return highest;
}

// Function to calculate the average price in the given values
function calculateAverage(values) {
    let total = 0;
    values.forEach(value => {
        total += parseFloat(value.high);
    });
    return total / values.length;
}

// Calling the main function to execute the code
main();
