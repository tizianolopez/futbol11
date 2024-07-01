let formations = [
    {
        "GK": null,
        "LB": null,
        "CB1": null,
        "CB2": null,
        "RB": null,
        "LM": null,
        "CM1": null,
        "CM2": null,
        "RM": null,
        "ST1": null,
        "ST2": null
    },
    {
        "GK": null,
        "LB": null,
        "CB1": null,
        "CB2": null,
        "RB": null,
        "CDM": null,
        "CM1": null,
        "CM2": null,
        "LW": null,
        "RW": null,
        "ST": null
    },
    {
        "GK": null,
        "LB": null,
        "CB1": null,
        "CB2": null,
        "RB": null,
        "CM1": null,
        "CM2": null,
        "CM3": null,
        "LW": null,
        "RW": null,
        "ST": null
    },
    {
        "GK": null,
        "LB": null,
        "CB1": null,
        "CB2": null,
        "RB": null,
        "CDM1": null,
        "CDM2": null,
        "CAM": null,
        "LW": null,
        "RW": null,
        "ST": null
    },
    {
        "GK": null,
        "LB": null,
        "CB1": null,
        "CB2": null,
        "CB3": null,
        "RB": null,
        "CM1": null,
        "CM2": null,
        "LW": null,
        "RW": null,
        "ST": null
    }
];

// Estructura de mapeo de posiciones para todas las formaciones
const positionMapping = {
    "GK": "GK",
    "LB": "LB",
    "CB1": "CB",
    "CB2": "CB",
    "CB3": "CB",
    "RB": "RB",
    "CDM": "CDM",
    "CDM1": "CDM",
    "CDM2": "CDM",
    "CM1": "CM",
    "CM2": "CM",
    "CM3": "CM",
    "CAM": "CAM",
    "LM": "LM",
    "RM": "RM",
    "LW": "LW",
    "RW": "RW",
    "ST": "ST",
    "ST1": "ST",
    "ST2": "ST"
};

let formation = {};
let selectedPlayerNationality = ''; // Variable global para almacenar la nacionalidad del jugador seleccionado


let currentCountry = "";
const total_countries = ["France","Norway","Belgium","Argentina","Poland","England","Brazil","Spain","Portugal","Germany","Netherlands","Egypt","Uruguay","Nigeria","Slovenia","Italy","Switzerland","Croatia","Korea Republic","Georgia","Algeria","Senegal","Scotland","Serbia","Cameroon","Costa Rica","Austria","Turkey","Morocco","Ghana","Denmark","Colombia","Hungary","Slovakia","Canada","Czech Republic","Bosnia and Herzegovina","Côte d'Ivoire","Ukraine","Montenegro","Iran","Sweden","Burkina Faso","Mexico","Greece","Tunisia","Japan","Libya","Chile","Finland","Armenia","Central African Republic","Paraguay","Mozambique","Kosovo","North Macedonia","Ecuador","Congo DR","Gabon","Mali","United States","Jamaica","Russia","Malta","Peru","Angola","Australia","Guinea","Suriname","Togo","Albania","Gambia","Israel","Trinidad and Tobago","Zimbabwe","Wales","Venezuela","Saudi Arabia","Romania","Republic of Ireland","Luxembourg","Liberia","Bulgaria","China PR","Iceland","Qatar","Equatorial Guinea","Burundi","Zambia","Cape Verde Islands","Guinea Bissau","Northern Ireland","New Zealand","Kenya","Bolivia","South Africa","Honduras","Comoros","Palestine","Benin","Madagascar","Azerbaijan","Iraq","Cyprus","Liechtenstein","Bermuda","Sierra Leone","Haiti","Philippines","Mauritania","Congo","Panama","United Arab Emirates","Ethiopia","India","Grenada","Curacao"];
const countries = ["France","Norway","Belgium","Argentina","Poland","England","Brazil","Spain","Portugal","Germany","Netherlands","Uruguay","Italy","Switzerland","Croatia","Georgia","Algeria","Senegal","Scotland","Serbia","Austria","Turkey","Morocco","Denmark","Colombia","Canada","Ukraine","Sweden","Mexico","Japan","Chile","Ecuador","United States"];
let usedCountries = [];

function getRandomCountry() {
    const remainingCountries = countries.filter(country => !usedCountries.includes(country));
    if (remainingCountries.length === 0) {
        // Reset the used countries if all have been used
        usedCountries = [];
    }
    const randomIndex = Math.floor(Math.random() * remainingCountries.length);
    const selectedCountry = remainingCountries[randomIndex];
    usedCountries.push(selectedCountry);
    return selectedCountry;
}

function getRandomFormation() {
    const randomIndex = Math.floor(Math.random() * formations.length);
    return formations[randomIndex];
}

function startGame() {
    formation = getRandomFormation();
    currentCountry = getRandomCountry();
    document.getElementById("country").textContent = `País: ${currentCountry}`;
    document.getElementById("message").textContent = "";
    // Resetea la formación
    for (let position in formation) {
        formation[position] = null;
    }
    updateFormation();
}


function submitPlayer() {
    const playerName = normalizeString(document.getElementById("playerInput").value.trim());
    const filteredPlayers = players.filter(p =>
        normalizeString(p.short_name) === playerName || normalizeString(p.long_name) === playerName
    );

    if (filteredPlayers.length === 0) {
        document.getElementById("message").textContent = "Jugador no encontrado.";
        return;
    }

    const playersInCountry = filteredPlayers.filter(p => p.nationality_name.toLowerCase() === currentCountry.toLowerCase());

    if (playersInCountry.length === 0) {
        document.getElementById("message").textContent = "El jugador no pertenece al país seleccionado.";
        return;
    }

    // Verificar si hay más de un jugador con el mismo nombre en el país
    if (playersInCountry.length > 1) {
        displayPlayerOptions(playerName, playersInCountry);
        return;
    }

    const player = playersInCountry[0];

    // Verificar si el jugador ya está en la formación
    if (Object.values(formation).includes(playerName)) {
        document.getElementById("message").textContent = "El jugador ya está en la formación.";
        return;
    }

    const playerPositions = player.player_positions.split(", ").map(pos => pos.toLowerCase());
    const positions = Object.keys(positionMapping).filter(pos => 
        playerPositions.includes(positionMapping[pos].toLowerCase()) && pos in formation
    );

    if (positions.length === 0) {
        document.getElementById("message").textContent = "El jugador no puede jugar en ninguna posición de la formación.";
        return;
    }

    const availablePositions = positions.filter(pos => !formation[pos]);

    if (availablePositions.length === 1) {
        const pos = availablePositions[0];
        formation[pos] = playerName;
        updateFormation(pos);
        document.getElementById("playerInput").value = "";
        document.getElementById("message").textContent = "";
        currentCountry = getRandomCountry(); // Selecciona un nuevo país
        document.getElementById("country").textContent = `País: ${currentCountry}`;
    } else {
        const genericPositions = availablePositions.map(pos => positionMapping[pos]);
        const uniqueGenericPositions = [...new Set(genericPositions)];

        if (uniqueGenericPositions.length === 1) {
            const pos = availablePositions[0];
            formation[pos] = playerName;
            updateFormation(pos);
            document.getElementById("playerInput").value = "";
            document.getElementById("message").textContent = "";
            currentCountry = getRandomCountry(); // Selecciona un nuevo país
            document.getElementById("country").textContent = `País: ${currentCountry}`;
        } else if (availablePositions.length > 1) {
            displayPositionOptions(playerName, availablePositions);
        } else {
            document.getElementById("message").textContent = "Todas las posiciones del jugador ya están ocupadas.";
        }
    }
}

function displayPlayerOptions(playerName, players) {
    const messageDiv = document.getElementById("message");
    messageDiv.innerHTML = `Se encontraron varios jugadores con el nombre ${playerName}. Elige uno:<br>`;

    players.forEach((player, index) => {
        const label = document.createElement("label");
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "playerOption";
        radio.value = index.toString(); // Usar el índice como valor para identificar la selección
        label.appendChild(radio);
        label.appendChild(document.createTextNode(`${player.long_name} (${player.nationality_name})`));
        messageDiv.appendChild(label);
        messageDiv.appendChild(document.createElement("br"));
    });

    const submitButton = document.createElement("button");
    submitButton.textContent = "Confirmar";
    submitButton.onclick = () => confirmPlayerOption(playerName, players);
    messageDiv.appendChild(submitButton);
}

function confirmPlayerOption(playerName, players) {
    const selectedOption = document.querySelector('input[name="playerOption"]:checked');
    if (selectedOption) {
        const selectedIndex = parseInt(selectedOption.value, 10);
        const selectedPlayer = players[selectedIndex];

        // Continuar con el proceso para agregar el jugador seleccionado a la formación
        const playerPositions = selectedPlayer.player_positions.split(", ").map(pos => pos.toLowerCase());
        const positions = Object.keys(positionMapping).filter(pos => 
            playerPositions.includes(positionMapping[pos].toLowerCase()) && pos in formation
        );

        if (positions.length === 0) {
            document.getElementById("message").textContent = "El jugador no puede jugar en ninguna posición de la formación.";
            return;
        }

        const availablePositions = positions.filter(pos => !formation[pos]);

        if (availablePositions.length === 1) {
            const pos = availablePositions[0];
            formation[pos] = playerName;
            updateFormation(pos);
            document.getElementById("playerInput").value = "";
            document.getElementById("message").textContent = "";
            currentCountry = getRandomCountry(); // Selecciona un nuevo país
            document.getElementById("country").textContent = `País: ${currentCountry}`;
        } else {
            displayPositionOptions(playerName, availablePositions);
        }
    } else {
        document.getElementById("message").textContent = "Por favor, selecciona una opción de jugador.";
    }
}


function normalizeString(str) {
    return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function displayPositionOptions(playerName, positions) {
    const messageDiv = document.getElementById("message");
    messageDiv.innerHTML = `Elige la posición para ${playerName}:<br>`;

    const groupedPositions = groupPositions(positions);

    groupedPositions.forEach(pos => {
        const label = document.createElement("label");
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "position";
        radio.value = pos;
        label.appendChild(radio);
        label.appendChild(document.createTextNode(pos));
        messageDiv.appendChild(label);
    });
    messageDiv.appendChild(document.createElement("br"));

    const submitButton = document.createElement("button");
    submitButton.textContent = "Confirmar";
    submitButton.onclick = () => confirmPosition(playerName);
    messageDiv.appendChild(submitButton);
}

function groupPositions(positions) {
    const grouped = {};
    const result = [];

    positions.forEach(pos => {
        const genericPos = positionMapping[pos];
        if (!grouped[genericPos]) {
            grouped[genericPos] = true;
            result.push(genericPos);
        }
    });

    return result;
}
function confirmPosition(playerName) {
    const selectedPosition = document.querySelector('input[name="position"]:checked');
    if (selectedPosition) {
        const genericPos = selectedPosition.value;
        const specificPositions = Object.keys(positionMapping).filter(pos => positionMapping[pos] === genericPos);
        
        // Encontrar la primera posición específica disponible
        let posToFill = null;
        for (let i = 0; i < specificPositions.length; i++) {
            const pos = specificPositions[i];
            if (!formation[pos]) {
                posToFill = pos;
                break;
            }
        }

        if (posToFill) {
            formation[posToFill] = playerName;
            updateFormation(posToFill);
            document.getElementById("playerInput").value = "";
            document.getElementById("message").textContent = "";
            currentCountry = getRandomCountry(); // Selecciona un nuevo país
            document.getElementById("country").textContent = `País: ${currentCountry}`;
        } else {
            document.getElementById("message").textContent = "Todas las posiciones del jugador ya están ocupadas.";
        }
    } else {
        document.getElementById("message").textContent = "Por favor, selecciona una posición.";
    }
}



const formationMap = {
    "ST": "attackers",
    "ST1": "attackers",
    "ST2": "attackers",
    "LW": "wingers",
    "RW": "wingers",
    "CAM": "offensiveMidfielders",
    "CM1": "midfielders",
    "CM2": "midfielders",
    "CM3": "midfielders",
    "LM": "wideMidfielders",
    "RM": "wideMidfielders",
    "CDM": "defensiveMidfielders",
    "CDM1": "defensiveMidfielders",
    "CDM2": "defensiveMidfielders",
    "LB": "fullbacks",
    "RB": "fullbacks",
    "LWB": "fullbacks",
    "RWB": "fullbacks",
    "CB1": "defenders",
    "CB2": "defenders",
    "CB3": "defenders",
    "GK": "goalkeeper"
};

const positionOrder = {
    "attackers": ["ST", "ST1", "ST2"],
    "wingers": ["LW", "RW"],
    "offensiveMidfielders": ["CAM"],
    "wideMidfielders": ["LM", "RM"],
    "midfielders": ["CM1", "CM2", "CM3"],
    "defensiveMidfielders": ["CDM", "CDM1", "CDM2"],
    "fullbacks": ["LB", "RB", "LWB", "RWB"],
    "defenders": ["CB1", "CB2", "CB3"],
    "goalkeeper": ["GK"]
};

function generateFormationContainers() {
    const formationDiv = document.getElementById("formation");
    formationDiv.innerHTML = ""; // Clear any existing content

    for (let section in positionOrder) {
        // Check if there are any positions in the section
        if (positionOrder[section].some(pos => pos in formation)) {
            const sectionDiv = document.createElement("div");
            sectionDiv.classList.add("position");
            sectionDiv.id = section;
            formationDiv.appendChild(sectionDiv);
        }
    }
}



function updateFormation(newPlayerPos = null) {
    generateFormationContainers(); // Genera contenedores necesarios antes de actualizar

    for (let row in positionOrder) {
        const positions = positionOrder[row];
        const sectionDiv = document.getElementById(row);
        if (sectionDiv) {
            sectionDiv.innerHTML = ""; // Limpia el contenido existente
            for (let pos of positions) {
                if (pos in formation) {
                    const player = formation[pos];
                    const card = document.createElement("div");
                    card.classList.add('card');

                    const front = document.createElement("div");
                    front.classList.add('side', 'front');
                    front.textContent = `${pos}`;

                    const back = document.createElement("div");
                    back.classList.add('side', 'back');
                    back.style.backgroundImage = `url('flags/${getPlayerCountry(player)}.png')`; // Ajusta la ruta según la estructura de tus archivos de banderas
                    
                    const textContainer = document.createElement("div");
                    textContainer.classList.add('text-container');
                    textContainer.textContent = `${player}`;
                    
                    back.appendChild(textContainer);

                    card.appendChild(front);
                    card.appendChild(back);

                    card.id = pos;
                    card.classList.add('position', pos);

                    sectionDiv.appendChild(card);

                    // Si es el nuevo jugador, aplicar la animación
                    if (player && pos === newPlayerPos) {
                        setTimeout(() => {
                            card.classList.add('flipped');
                        }, 100);
                    } else if (player) {
                        // Si no es el nuevo jugador pero tiene jugador, asegurarse que esté flippeado
                        card.classList.add('flipped');
                    }
                }
            }
        }
    }
}




function getPlayerCountry(playerName) {
    const player = players.find(p => normalizeString(p.short_name) === playerName || normalizeString(p.long_name) === playerName);
    return player ? player.nationality_name.toLowerCase() : '';
}

function restartGame() {
    startGame();
}

document.addEventListener("DOMContentLoaded", () => {
    startGame();
    document.getElementById("playerInput").addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Evita el envío del formulario si existe
            submitPlayer();
        }
    });
});
