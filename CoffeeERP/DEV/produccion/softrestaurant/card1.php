<!-- CARD 1 -->
<style>
.grid-container {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    width: 100%;
}

.grid-item-card1 {
    flex-basis: 100;
    color: white;
    margin: 1.25em 1em;
    text-align: center;
    justify-content: center;
    align-items: center;
    width: 10em;
    height: 10em;
    box-shadow: 0.25em 0.25em 1em rgba(0, 0, 0, 0.25);
    border-radius: 0.5em;
    background-color: aqua;
    cursor: pointer;
}

.grid-item-card1 .info_body {
    height: 6.5em;
    border-top-left-radius: 0.5em;
    border-top-right-radius: 0.5em;
}

.grid-item-card1 .info_body img {
    max-height: 100%;
    border-top-left-radius: 0.5em;
    border-top-right-radius: 0.5em;
}

.grid-item-card1 .info_footer {
    height: 3.5em;
    border-bottom-right-radius: 0.5em;
    border-bottom-left-radius: 0.5em;
}

.grid-item-card1 .info_number {
    height: 2em;
    width: 2em;
    position: relative;
    top: -10em;
    border-top-right-radius: 0.42em;
}

.grid-item-card1:hover {
    z-index: 2;
    transform: scale(1.05);
    opacity: calc(100% - 6%);
    transition: all 0.2s ease;
    box-shadow: 0 0 1.2em rgba(0, 0, 0, 0.5);
}
</style>

<div class="grid-container">
    <div class="grid-item-card1">
        <div class="col-12 d-flex info_body">
            <img class="col-12"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTK8FOjaHtbRyeyWMvRCXgBNCEL1OrZvPlU-w&usqp=CAU"
                alt="">
        </div>
        <div class="col-12 bg-warning d-flex flex-column pt-1 info_footer">
            <h6>Producto</h6>
            <sub class="fw-bold">$150</sub>
        </div>
        <div class="d-flex ms-auto bg-warning justify-content-center align-items-center info_number"
            title="cantidad items">
            <label class="fs-6 fw-bold">0</label>
        </div>
    </div>
    <div class="grid-item-card1">
        <div class="col-12 d-flex info_body">
            <img class="col-12"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgy9At8n45AxQ9aGG1fwr-A8WDTSnFSFreZQ&usqp=CAU"
                alt="">
        </div>
        <div class="col-12 bg-warning d-flex flex-column pt-1 info_footer">
            <h6>Producto</h6>
            <sub class="fw-bold">$150</sub>
        </div>
        <div class="d-flex ms-auto bg-warning justify-content-center align-items-center info_number">
            <label class="fs-6 fw-bold">12</label>
        </div>
    </div>
    <div class="grid-item-card1">
        <div class="col-12 d-flex info_body">
            <img class="col-12" src="https://s1.significados.com/foto/flor-de-loto-rosa.jpg" alt="">
        </div>
        <div class="col-12 bg-warning d-flex flex-column pt-1 info_footer">
            <h6>Producto</h6>
            <sub class="fw-bold">$150</sub>
        </div>
        <div class="d-flex ms-auto bg-warning justify-content-center align-items-center info_number">
            <label class="fs-6 fw-bold">12</label>
        </div>
    </div>
    <div class="grid-item-card1">
        <div class="col-12 d-flex info_body">
            <img class="col-12"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROgahnp8rf3gkAyp-jRchsNEuYOrYgZ5BtMQ&usqp=CAU"
                alt="">
        </div>
        <div class="col-12 bg-warning d-flex flex-column pt-1 info_footer">
            <h6>Producto</h6>
            <sub class="fw-bold">$150</sub>
        </div>
        <div class="d-flex ms-auto bg-warning justify-content-center align-items-center info_number">
            <label class="fs-6 fw-bold">12</label>
        </div>
    </div>
    <div class="grid-item-card1">
        <div class="col-12 d-flex info_body">
            <img class="col-12"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFG1m8cHJEfi8AM6vWVYJZaRXfcWcLIQZGiw&usqp=CAU"
                alt="">
        </div>
        <div class="col-12 bg-warning d-flex flex-column pt-1 info_footer">
            <h6>Producto</h6>
            <sub class="fw-bold">$150</sub>
        </div>
        <div class="d-flex ms-auto bg-warning justify-content-center align-items-center info_number">
            <label class="fs-6 fw-bold">12</label>
        </div>
    </div>
</div>