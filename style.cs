* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Courier New', Courier, monospace;
    font-weight: bold;
    user-select: none;
}

body {
    background-color: #0b1414;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    overflow: hidden;
}

#game-container {
    position: relative;
    width: 800px;
    height: 450px;
    border: 4px solid #3a5f56;
    box-shadow: 0 0 20px rgba(0, 255, 200, 0.2);
}

canvas {
    background-color: #122422;
    display: block;
    cursor: crosshair;
}

/* HUD Styling */
#hud-frags {
    position: absolute;
    top: 20px;
    left: 20px;
    color: #ffffff;
    font-size: 28px;
    text-shadow: 2px 2px #000;
}

#hud-bottom {
    position: absolute;
    bottom: 15px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 0 30px;
    color: #ffffff;
    font-size: 28px;
    text-shadow: 2px 2px #000;
    pointer-events: none;
}

/* Lunch Menu Screen Overlay */
#lunch-modal {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(10, 25, 22, 0.95);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
}

.modal-content {
    background: #1a332e;
    border: 3px solid #00ffcc;
    padding: 30px;
    text-align: center;
    max-width: 80%;
    color: #fff;
    border-radius: 10px;
    box-shadow: 0 0 15px #00ffcc;
}

.modal-content h2 {
    color: #00ffcc;
    margin-bottom: 15px;
}

#lunch-list {
    margin: 20px 0;
    text-align: left;
    background: #0f211e;
    padding: 15px;
    border-radius: 5px;
    max-height: 200px;
    overflow-y: auto;
    font-size: 16px;
    line-height: 1.5;
    border: 1px solid #3a5f56;
}

button {
    background: #00ffcc;
    color: #122422;
    border: none;
    padding: 10px 20px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    border-radius: 5px;
    transition: 0.2s;
}

button:hover {
    background: #fff;
    box-shadow: 0 0 10px #fff;
}

.hidden {
    display: none !important;
}
