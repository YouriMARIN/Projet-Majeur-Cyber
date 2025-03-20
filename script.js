fetch("reference.json")
    .then(response => response.json())
    .then(jsondata => 
        {
        var criteres = jsondata.criteres;

        // Mapping between thematique values and corresponding tables
        var tableMapping = 
        {
            "Stratégie": document.getElementById("tableStrategie"),
            "Spécifications": document.getElementById("tableSpécifications"),
            "Architecture": document.getElementById("tableArchitecture"),
            "UX/UI": document.getElementById("tableUxUi"),
            "Contenus": document.getElementById("tableContenus"),
            "Frontend": document.getElementById("tableFrontend"),
            "Backend": document.getElementById("tableBackend"),
            "Hébergement": document.getElementById("tableHebergement"),
        };
        criteres.forEach(function (critere) 
        {
            // Check if the table for the current thematique exists in the mapping
            if (tableMapping.hasOwnProperty(critere.thematique)) 
            {
                var currentTable = tableMapping[critere.thematique];
        
                var row = currentTable.insertRow(-1); // Use -1 to append rows at the end
                row.insertCell(0).innerHTML = critere.id;
                row.insertCell(1).innerHTML = critere.critere;
                row.insertCell(2).innerHTML = critere.thematique;
                row.insertCell(3).innerHTML = critere.objectif;
                row.insertCell(4).innerHTML = critere.miseEnOeuvre;
                row.insertCell(5).innerHTML = critere.controle;
        
                var evaluationCell = row.insertCell(6);
                evaluationCell.classList.add('evaluation');
        
                evaluationCell.innerHTML = `
                    <label for="etat_${critere.id}">État :</label>
                    <select id="etat_${critere.id}" name="etat_${critere.id}">
                        <option value="blank">blank</option>
                        <option value="conformes">Conformes</option>
                        <option value="en_cours">En cours</option>
                        <option value="non_conforme">Non conforme</option>
                        <option value="non_applicable">Non applicable</option>
                    </select>
                `;
            }
        });        
    })
    .catch(error => console.error("Error", error));

    function compterCasesCochées() 
    {
        var casesCochées = document.querySelectorAll('input[type="checkbox"]:checked').length;
        document.getElementById('resultat').innerHTML = "Nombre de cases cochées : " + casesCochées;
    }

    function evaluateButton(){ 
        if (document.getElementById("websiteInput").value !== "")
        {
            document.getElementById("telecharger").style.display ="block";
            document.getElementById("filterOptions").style.display = "block";
            document.getElementById("criteriaForm").style.display = "none";
            document.getElementById("websiteID").style.display ="block";
            document.getElementById("websiteID").innerHTML = "Votre site est: " + document.getElementById("websiteInput").value;
            document.getElementById("websiteID").style.textAlign = "center";
            document.getElementById("websiteID").style.fontSize = "38px";
        }
        else
        {
            alert("Input cannot be empty or invalid ")
        }
    }
    
    function handleButtonClick(event) {
        if (event.target.tagName === 'BUTTON') {
            var tables = document.querySelectorAll('table');
            tables.forEach(function (table) {
                table.style.display = 'none';
            });
            var buttonId = event.target.id;
            var tableId = 'table' + buttonId;
            var table = document.getElementById(tableId);
            if (table) {
                table.style.display = 'block'; 
            }
        }
    }

    function generateRecapitulation() {
        var confor = 0;
        var non_app = 0;
        var tableTable = [
            document.getElementById('tableStrategie'),
            document.getElementById('tableSpécifications'),
            document.getElementById('tableArchitecture'),
            document.getElementById('tableUxUi'),
            document.getElementById('tableContenus'),
            document.getElementById('tableFrontend'),
            document.getElementById('tableBackend'),
            document.getElementById('tableHebergement')
        ]; 
    
        var recapData = []; // Move the array outside the loop
    
        for (var z = 0; z < tableTable.length; z++) {
            for (var i = 0; i < tableTable[z].rows.length; i++) {
                var row = tableTable[z].rows[i];
                var selectElement = row.cells[6].querySelector('select');
                var etatValue = selectElement ? selectElement.value : '';
    
                if (etatValue !== 'blank') {
                    var rowData = {
                        id: row.cells[0].innerText,
                        critere: row.cells[1].innerText,
                        thematique: row.cells[2].innerText,
                        etat: etatValue
                    };
                    console.log(rowData); 
    
                    if (etatValue === "conformes") {
                        confor++;
                    }
                    if (etatValue === "non_applicable") {
                        non_app++;
                    }
                    recapData.push(rowData); 
                }
            }
        }
    
        var recapContainer = document.getElementById('recapContainer');
        recapContainer.innerHTML = ''; 
        var ul = document.createElement('ul');
    
    
        recapData.forEach(function (row) {
            var li = document.createElement('li');
            li.textContent = `ID: ${row.id}, Critere: ${row.critere}, Thematique: ${row.thematique}, État: ${row.etat}`;
            ul.appendChild(li);
        });
    
        recapContainer.appendChild(ul);
    
        var score = (confor / (79 - non_app))*100;

        // Mise à jour de la jauge de score
        updateScoreGauge(score);
            // document.getElementById("scoreID").innerHTML = confor / (79-non_app);
    }
    let gauge = null;

    function updateScoreGauge(score) {
        var t = document.createElement('p') ;
        t.textContent = `${score} %`;

        if(!gauge){
         gauge = new JustGage({
            id: "gauge", // ID de l'élément HTML où la jauge sera affichée
            value: score, // Valeur du score
            min: 0, // Valeur minimale de la jauge
            max: 100, // Valeur maximale de la jauge (tu peux ajuster selon tes besoins)
            title: "Score", // Titre de la jauge
            label: "", // Étiquette de la jauge (peut être vide)
            levelColors: ["#ff0000", "#ffa500", "#00ff00"], // Couleurs des niveaux de la jauge
            gaugeWidthScale: 0.6, // Échelle de la largeur de la jauge
            counter: true, // Affiche la valeur numérique
            decimals: 2, // Nombre de décimales pour la valeur
            pointer: true, // Affiche le pointeur sur la jauge
        });
    }else{
        gauge.refresh(score);
    }
    }

    function generatePDF() {
        const doc = new jsPDF('p','mm','a4'); // Créez un nouveau document PDF
        const liste = document.getElementById('recapContainer');
        // Ajoutez le titre ou le texte d'introduction au PDF
        doc.setFontSize(24);
        doc.setFont('times','normal');
        doc.text('Compte rendu Ecoévaluation', 105 , 25,null,null,'center');
        doc.setFontSize(18);
        doc.setFont('times','normal');
        doc.text('Voici la liste des critères selectionnés :', 20, 50);
        // Récupérez les lignes de la table
        const rows = liste.getElementsByTagName('ul');
        const maxWidth = 172;
        const pageHeight = 300;
        const fontSize = 12;
        // Position de départ pour afficher les données dans le PDF
        let y = 60;
        // Parcourez chaque ligne de la table
        for (let i = 0; i < rows.length; i++) {
            const cells = rows[i].getElementsByTagName('li');
            // Affichez les données dans le PDF
            for (let j = 0; j < cells.length; j++) {
                const text = cells[j].innerHTML;
                const textWidth = doc.getStringUnitWidth(text) ;
                const lineHeight = 0.5;
                const textLine =doc.splitTextToSize(text, maxWidth);
    
                for (let k = 0; k < textLine.length; k++) {
                    if (textWidth < maxWidth){
                        doc.setFont('times','normal');
                        doc.setFontSize(fontSize);
                        doc.text(textLine[k], 20, y);
                        // doc.splitTextToSize(textLine, activeFont);
                        y += 10; // Espace entre chaque ligne
                    } else {
                        const ratio = maxWidth / fontSize ;
                        const adjustedFontSize = fontSize * ratio;
                        doc.addPage("a4",'p');
                        doc.setFont('times','normal');
                        doc.setFontSize(adjustedFontSize);
                        doc.text(textLine[k], 20, y);
                        y += 10; // Espace entre chaque ligne
                    }
                    if (y > pageHeight - 20) { // 20 est une marge pour éviter les débordements
                        doc.addPage('a4','p'); // Ajoute une nouvelle page
                        y = 20; // Réinitialise la position verticale
                    }
                    
                    y += lineHeight;
                
                }
            }
    
        }
        doc.setFontSize(28);
        doc.text("Votre score est de : " , 20,200);
        doc.setFontSize(64);
        doc.setFont("times", "bold");
        doc.setTextColor('#136404');
        doc.text(gauge.originalValue + "%", 72,240);

        // Téléchargez le PDF avec un nom de fichier spécifique
        doc.save('Compte_rendu.pdf');
    }
    

document.addEventListener('DOMContentLoaded', function() {
    var generateRecapButton = document.getElementById("generateRecap");

    if (generateRecapButton) {
        generateRecapButton.addEventListener('click', function() {
            generateRecapitulation();
        });
    } else {
        console.error("Element with ID 'generateRecap' not found.");
    }
});

