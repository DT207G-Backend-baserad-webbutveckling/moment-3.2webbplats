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
