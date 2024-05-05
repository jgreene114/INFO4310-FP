const sshsExplanation = "Saffir-Simpson Hurricane Scale information based on the wind speed provided by the US agency wind speed (US agencies provide 1-minute wind speeds)\n" +
    "-5 = Unknown [XX]\n" +
    "-4 = Post-tropical [EX, ET, PT]\n" +
    "-3 = Miscellaneous disturbances [WV, LO, DB, DS, IN, MD]\n" +
    "-2 = Subtropical [SS, SD]\n" +
    "Tropical systems classified based on wind speeds [TD, TS, HU, TY,, TC, ST, HR]\n" +
    "-1 = Tropical depression (W<34) 0 = Tropical storm [34<W<64]\n" +
    "1 = Category 1 [64<=W<83]\n" +
    "2 = Category 2 [83<=W<96]\n" +
    "3 = Category 3 [96<=W<113] 4 = Category 4 [113<=W<137] 5 = Category 5 [W >= 137]"

const sshsExplanationHtml = `
    <div class="quotation">
    <div class="container sshs-explanation">
        <a href="https://www.google.com" target="_blank"><h1>Saffir-Simpson Hurricane Scale (SSHS)</h1></a>
        <p>Information based on the wind speed provided by US agencies (1-minute wind speeds).</p>
        <ul>
            <li><span class="category">Unknown [-5]</span>: XX</li>
            <li><span class="category">Post-tropical [-4]</span>: EX, ET, PT</li>
            <li><span class="category">Miscellaneous disturbances [-3]</span>: WV, LO, DB, DS, IN, MD</li>
            <li><span class="category">Subtropical [-2]</span>: SS, SD</li>
            <li><span class="category">Tropical Depression [-1]</span>: Wind speed less than <span class="boldFont">34 mph</span></li>
            <li><span class="category">Tropical Storm [0]</span>: Wind speed between <span class="bold-font">34 mph and 63 mph</span></li>
            <li><span class="category">Category 1 [1]</span>: Wind speed between <span class="bold-font">64 mph and 82 mph</span></li>
            <li><span class="category">Category 2 [2]</span>: Wind speed between <span class="bold-font">83 mph and 95 mph</span></li>
            <li><span class="category">Category 3 [3]</span>: Wind speed between <span class="bold-font">96 mph and 112 mph</span></li>
            <li><span class="category">Category 4 [4]</span>: Wind speed between <span class="bold-font">113 mph and 136 mph</span></li>
            <li><span class="category">Category 5 [5]</span>: Wind speed <span class="bold-font">137 mph or higher</span></li>
        </ul>
    </div>
    </div>
`

const dsshsExplanationDict = {
    "-5": "Unknown - XX",
    "-4": "Post-tropical storm - EX, ET, PT",
    "-3": "Miscellaneous disturbances - WV, LO, DB, DS, IN, MD",
    "-2": "Subtropical - SS, SD",
    "-1": "Tropical Depression - Wind speed less than 34 mph",
    "0": "Tropical Storm - Wind speed between 34 mph and 63 mph",
    "1": "Category 1 Hurricane - Wind speed between 64 mph and 82 mph",
    "2": "Category 2 Hurricane - Wind speed between 83 mph and 95 mph",
    "3": "Category 3 Hurricane - Wind speed between 96 mph and 112 mph",
    "4": "Category 4 Hurricane - Wind speed between 113 mph and 136 mph",
    "5": "Category 5 Hurricane - Wind speed 137 mph or higher"
};

const sshsExplanationDict = {
    "-5": `<div class="sshs-explanation"><span class="category">Unknown [-5]</span>: XX</div>`,
    "-4": `<div class="sshs-explanation"><span class="category">Post-tropical [-4]</span>: EX, ET, PT</div>`,
    "-3": `<div class="sshs-explanation"><span class="category">Miscellaneous disturbances [-3]</span>: WV, LO, DB, DS, IN, MD</div>`,
    "-2": `<div class="sshs-explanation"><span class="category">Subtropical [-2]</span>: SS, SD</div>`,
    "-1": `<div class="sshs-explanation"><span class="category">Tropical Depression [-1]</span>: Wind speed less than <span class="bold-font">34 mph</span></div>`,
    "0":  `<div class="sshs-explanation"><span class="category">Tropical Storm [0]</span>: Wind speed between <span class="bold-font">34 mph and 63 mph</span></div>`,
    "1":  `<div class="sshs-explanation"><span class="category">Category 1 [1]</span>: Wind speed between <span class="bold-font">64 mph and 82 mph</span></div>`,
    "2":  `<div class="sshs-explanation"><span class="category">Category 2 [2]</span>: Wind speed between <span class="bold-font">83 mph and 95 mph</span></div>`,
    "3":  `<div class="sshs-explanation"><span class="category">Category 3 [3]</span>: Wind speed between <span class="bold-font">96 mph and 112 mph</span></div>`,
    "4":  `<div class="sshs-explanation"><span class="category">Category 4 [4]</span>: Wind speed between <span class="bold-font">113 mph and 136 mph</span></div>`,
    "5":  `<div class="sshs-explanation"><span class="category">Category 5 [5]</span>: Wind speed <span class="bold-font">137 mph or higher</span></div>`,
};
