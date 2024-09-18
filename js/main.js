// Körs när hela sidan har laddats
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('experience-list')) {
        fetchExperiences();
    }
});

// hämta alla arbetserfarenheter från servern
function fetchExperiences() {
    fetch('http://localhost:4680/api/workexperience')
        .then(response => response.json())
        .then(data => {
            const experienceList = document.getElementById('experience-list');

            // Töm listan innan vi fyller på den
            experienceList.innerHTML = '';
            data.forEach(exp => {

                // Skapa nytt listobjekt
                const li = document.createElement('li');

                // Formatera datum för visning
                const startDate = new Date(exp.startdate).toLocaleDateString();
                const endDate = exp.enddate ? new Date(exp.enddate).toLocaleDateString() : 'Present';

                // Fyll listobjektet med data och lägg till knappar för redigering och radering
                li.innerHTML = `
                    ${exp.companyname} - ${exp.jobtitle} (${startDate} - ${endDate})
                    <button onclick="editExperience('${exp._id}', this)">Uppdatera</button>
                    <button onclick="deleteExperience('${exp._id}')">Radera</button>
                `;

                // Lägg till objektet i listan
                experienceList.appendChild(li);
            });
        })
        .catch(error => console.error('Error fetching experiences:', error));
}

function deleteExperience(id) {
    if (confirm('Är du säker på att du vill radera denna arbetserfarenhet?')) {
        fetch(`http://localhost:4653/api/workexperience/${id}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (response.ok) {
                    alert('Arbetserfarenheten har raderats.');
                    fetchExperiences(); // Uppdatera listan efter borttagning
                } else {
                    alert('Något gick fel, kunde inte radera arbetserfarenheten.');
                }
            })
            .catch(error => console.error('Error deleting experience:', error));
    }
}

function editExperience(id, button) {
    const li = button.parentNode;
    const fields = li.firstChild.textContent.split(' - ');

    const companyname = prompt('Ange företagsnamn:', fields[0]);
    const jobtitle = prompt('Ange jobbtitel:', fields[1].split(' (')[0]);
    const dates = fields[1].match(/\(([^)]+)\)/)[1].split(' - ');
    const startdate = prompt('Ange startdatum (YYYY-MM-DD):', dates[0]);
    const enddate = prompt('Ange slutdatum (YYYY-MM-DD) eller lämna tomt för pågående:', dates[1] === 'Present' ? '' : dates[1]);

    if (companyname && jobtitle && startdate) {
        const updatedExperience = {
            companyname,
            jobtitle,
            startdate: new Date(startdate).toISOString(),
            enddate: enddate ? new Date(enddate).toISOString() : null
        };

        fetch(`http://localhost:4653/api/workexperience/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedExperience)
        })
            .then(response => {
                if (response.ok) {
                    alert('Arbetserfarenheten har uppdaterats.');
                    fetchExperiences(); // Uppdatera listan efter uppdatering
                } else {
                    alert('Något gick fel, kunde inte uppdatera arbetserfarenheten.');
                }
            })
            .catch(error => console.error('Error updating experience:', error));
    }
}