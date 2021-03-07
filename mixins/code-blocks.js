import Prism from 'prismjs';
import 'prismjs/plugins/line-numbers/prism-line-numbers.js';
import 'prismjs/plugins/line-highlight/prism-line-highlight.js';
import 'prismjs/plugins/line-highlight/prism-line-highlight.css';
import 'prismjs/components/prism-sql.js';
export default {
    mounted() {
        document.getElementsByClassName('language-text')
            .forEach(e => e.classList.remove('line-numbers'));

        Prism.highlightAll();

        document.getElementsByClassName('filename')
            .forEach((e) => {
                const split = e.textContent.split('//');
                const filename = split[0];
                const version = split[1];

                if (version) {
                    e.textContent = '';
                    e.appendChild(document.createTextNode(filename));

                    const versEl = document.createElement('em');
                    versEl.classList.add('d-block', 'text-right');
                    versEl.appendChild(document.createTextNode('SQL Server ' + version + '+'));

                    e.appendChild(versEl);
                }
            });
    }
};
