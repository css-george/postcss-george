module.exports = function(options) {
    options = options || {};

    return {
        postcssPlugin: 'postcss-george',
        prepare(result) {
            const values = Object.create(null);
            let exportNext = false;

            return {
                Comment(comment) {
                    if (comment.text.match(/\@export/)) {
                        exportNext = true;

                        if (options.stripGeorgeComments) {
                            comment.remove();
                        }
                    }
                },

                Declaration(decl) {
                    if (exportNext && decl.variable && decl.prop.substring(2) !== '') {
                        values[decl.prop.substring(2)] = decl.value;
                    }

                    exportNext = false;
                },

                OnceExit(root, { Comment }) {
                    const b64Map = Buffer.from(JSON.stringify(values)).toString('base64');

                    root.append(new Comment({
                        text: `# georgeMappingURL=data:application/json;charset=utf-8;base64,${b64Map}`
                    }));
                }
            };
        }
    };
};

module.exports.postcss = true;
