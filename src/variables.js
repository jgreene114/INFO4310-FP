const sshsExplanationHtml = `
    <div class="container sshs-explanation">
        <h1>Saffir-Simpson Hurricane Scale (SSHS)</h1>
        <ul>
            <li><span class="category">Unknown [-5]</span>: XX</li>
            <li><span class="category">Post-tropical [-4]</span>: EX, ET, PT</li>
            <li><span class="category">Miscellaneous disturbances [-3]</span>: WV, LO, DB, DS, IN, MD</li>
            <li><span class="category">Subtropical [-2]</span>: SS, SD</li>
            <li><span class="category">Tropical Depression [-1]</span>: Wind speed less than <span class="boldFont">39 mph</span></li>
            <li><span class="category">Tropical Storm [0]</span>: Wind speed <span class="bold-font">39 - 73 mph</span></li>
            <li><span class="category">Category 1 [1]</span>: Wind speed <span class="bold-font">74 - 95 mph</span></li>
            <li><span class="category">Category 2 [2]</span>: Wind speed <span class="bold-font">96 - 110 mph</span></li>
            <li><span class="category">Category 3 [3]</span>: Wind speed <span class="bold-font">111 - 129 mph</span></li>
            <li><span class="category">Category 4 [4]</span>: Wind speed <span class="bold-font">130 - 156 mph</span></li>
            <li><span class="category">Category 5 [5]</span>: Wind speed <span class="bold-font">157 mph or higher</span></li>
        </ul>
        <a href="https://spaceplace.nasa.gov/hurricanes/en/"
                                target="_blank">(CITE)</a>                                
    </div>
`

const sshsExplanationDict = {

    "-5": `<div class="sshs-explanation"><span class="category">Unknown [-5]</span>: XX</div>`,
    "-4": `<div class="sshs-explanation"><span class="category">Post-tropical [-4]</span>: EX, ET, PT</div>`,
    "-3": `<div class="sshs-explanation"><span class="category">Miscellaneous disturbances [-3]</span>: WV, LO, DB, DS, IN, MD</div>`,
    "-2": `<div class="sshs-explanation"><span class="category">Subtropical [-2]</span>: SS, SD</div>`,
    "-1": `<div class="sshs-explanation"><span class="category">Tropical Depression [-1]</span>: Wind speed less than <span class="boldFont">39 mph</span></div>`,
    "0":  `<div class="sshs-explanation"><span class="category">Tropical Storm [0]</span>: Wind speed <span class="bold-font">39 - 73 mph</span></div>`,
    "1":  `<div class="sshs-explanation"><span class="category">Category 1 [1]</span>: Wind speed <span class="bold-font">74 - 95 mph</span></div>`,
    "2":  `<div class="sshs-explanation"><span class="category">Category 2 [2]</span>: Wind speed <span class="bold-font">96 - 110 mph</span></div>`,
    "3":  `<div class="sshs-explanation"><span class="category">Category 3 [3]</span>: Wind speed <span class="bold-font">111 - 129 mph</span></div>`,
    "4":  `<div class="sshs-explanation"><span class="category">Category 4 [4]</span>: Wind speed <span class="bold-font">130 - 156 mph</span></div>`,
    "5":  `<div class="sshs-explanation"><span class="category">Category 5 [5]</span>: Wind speed <span class="bold-font">157 mph or higher</span></div>`,
};
