document.getElementById('fileInput').addEventListener('change', handleFileUpload);

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const fileContent = e.target.result;
            processFileData(fileContent);
        };
        reader.readAsText(file);
    }
}

function processFileData(fileContent) {
    // Split file content by lines
    const lines = fileContent.split('\n');
    const seatLayout = {
        A: 1, B: 2, C: 3, D: 4, 
        A1: 1, B1: 2, C1: 3, D1: 4,
        A2: 5, B2: 6, C2: 7, D2: 8,
        A3: 9, B3: 10, C3: 11, D3: 12,
        A4: 13, B4: 14, C4: 15, D4: 16
    };

    const bookings = lines.map(line => {
        const [bookingID, seats] = line.split('\t');
        const seatArray = seats.split(',');
        let proximity = 0;
        seatArray.forEach(seat => {
            proximity += seatLayout[seat] || 0;
        });
        return { bookingID, proximity };
    });

    // Sort bookings by proximity and booking ID in case of ties
    bookings.sort((a, b) => {
        if (a.proximity === b.proximity) {
            return a.bookingID - b.bookingID; // Sort by Booking ID in case of tie
        }
        return a.proximity - b.proximity; // Sort by proximity to the front
    });

    // Generate boarding sequence
    const tableBody = document.querySelector('#boardingSequenceTable tbody');
    tableBody.innerHTML = ''; // Clear previous content
    bookings.forEach((booking, index) => {
        const row = document.createElement('tr');
        const seqCell = document.createElement('td');
        seqCell.textContent = index + 1;
        const bookingCell = document.createElement('td');
        bookingCell.textContent = booking.bookingID;
        row.appendChild(seqCell);
        row.appendChild(bookingCell);
        tableBody.appendChild(row);
    });
}
