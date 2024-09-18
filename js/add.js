// Kör koden när sidan har laddats
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('add-experience-form')) {
        // Lägg till en event listener för formulärets submit-händelse
        document.getElementById('add-experience-form').addEventListener('submit', addExperience);
    }
});

// Funktion som körs när formuläret skickas in
function addExperience(event) {

    // Hindra sidan från att ladda om
    event.preventDefault();
    const form = event.target;

    // Skapar ett objekt med erfarenheter från formulärets värden
    const experience = {
        companyname: form.companyname.value,
        jobtitle: form.jobtitle.value,
        location: form.location.value,
        startdate: form.startdate.value,
        enddate: form.enddate.value,
        description: form.description.value
    };

    console.log('Sending data:', experience);

    // POST-förfrågan till servern
    fetch('http://localhost:4680/api/workexperience', {
        method: 'POST',
        headers: {

            // Säg till servern att vi skickar JSON
            'Content-Type': 'application/json'
        },
        // Konvertera till en JSON-sträng
        body: JSON.stringify(experience)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            form.reset();
            window.location.href = 'index.html';
        })
        .catch(error => console.error('Error adding experience:', error));
}
