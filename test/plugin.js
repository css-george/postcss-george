const test = require('node:test');
const postcss = require('postcss');
const plugin = require('../index.js');

// Helper functions
async function process(inputSrc, options) {
    const result = await postcss([plugin(options)]).process(inputSrc, { from: 'test.css' });
    return result.css;
}

function parseMapping(compiledSrc) {
    var matches = compiledSrc.match(/georgeMappingURL=(\S+)/);

    if (matches && matches[1]) {
        const mapUrl = matches[1];
        const split = mapUrl.split(',');

        if (split[0].match(/^data:/)) {
            return JSON.parse(Buffer.from(split[1], 'base64').toString('utf-8'));
        }
    }

    throw new Error("Unable to parse mapping URL");
}

async function processAndParse(inputSrc, options) {
    return parseMapping(await process(inputSrc, options));
}



test('simple annotation', async function(t) {
    const input = `
        :root {
            /* @export */ --variable: blue;
        }
    `;

    const result = await process(input);

    t.assert.match(result, /georgeMappingURL=\S+/, 'has a mapping URL');

    const mapping = parseMapping(result);

    t.assert.equal(mapping['variable'], 'blue', 'maps the exported variable');
});


test('multiple variables', async function(t) {
    const input = `
        :root {
            --not-exported: none;
            /* @export */ --variable: blue;
        }

        div {
            /*@export*/ --div-color: red;
            /* @export */ background: lime;

            /* Not exported */ color: var(--div-color);
            /* @export */ border-color: var(--variable);
        }
    `;

    const mapping = await processAndParse(input);

    t.assert.equal(Object.keys(mapping).length, 2, 'has the right number of exported variables');
    t.assert.ok(!mapping.hasOwnProperty('not-exported'), 'excludes non-exported variables');
    t.assert.equal(mapping['div-color'], 'red', 'includes all exported variables');
});


test('stripping comments', async function(t) {
    const input = `
        :root {
            /* @export */ --variable: blue;
        }
    `;

    const result = await process(input, { stripGeorgeComments: true });

    t.assert.doesNotMatch(result, /\@export/, 'removes @export comments');
});
