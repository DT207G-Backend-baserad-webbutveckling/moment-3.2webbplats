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

// Funktion för att radera en arbetserfarenhet
function deleteExperience(id) {

    // Bekräfta innan radering
    if (confirm('Är du säker på att du vill radera denna arbetserfarenhet?')) {
        fetch(`http://localhost:4680/api/workexperience/${id}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (response.ok) {
                alert('Arbetserfarenheten har raderats.');

                // Uppdatera listan efter borttagning
                fetchExperiences(); 
            } else {
                alert('Något gick fel, kunde inte radera arbetserfarenheten.');
            }
        })
        .catch(error => console.error('Error deleting experience:', error));
    }
}

// Funktion för att redigera en arbetserfarenhet
function editExperience(id, button) {
    const li = button.parentNode;
    const textContent = li.firstChild.textContent;
    
   // Dela upp texten för att extrahera nuvarande värden
    const [companynameJobtitle, dates] = textContent.split(' (');
    const [companyname, jobtitle] = companynameJobtitle.split(' - ');
    const [startDateStr, endDateStr] = dates.slice(0, -1).split(' - ');
    
    // Fråga användaren om nya värden med de gamla som förval
    const newCompanyName = prompt('Ange företagsnamn:', companyname.trim());
    const newJobTitle = prompt('Ange jobbtitel:', jobtitle.trim());
    const newStartDate = prompt('Ange startdatum (YYYY-MM-DD):', startDateStr.trim());
    const newEndDate = prompt('Ange slutdatum (YYYY-MM-DD) eller lämna tomt för pågående:', endDateStr.trim() !== 'Present' ? endDateStr.trim() : '');
    
     // Om användaren har fyllt i allt, skicka uppdateringen till servern
    if (newCompanyName && newJobTitle && newStartDate) {
        const updatedExperience = {
            companyname: newCompanyName,
            jobtitle: newJobTitle,
            startdate: new Date(newStartDate).toISOString(),
            enddate: newEndDate ? new Date(newEndDate).toISOString() : null,
        };

        fetch(`http://localhost:4680/api/workexperience/${id}`, {
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
