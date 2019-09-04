import {
    CircInterface,
    CircStoreInterface,
    ControlInterface,
    EngineInterface,
    QuickControlInterface
} from "../../structure";

export default class StorageControl implements ControlInterface, QuickControlInterface {
    protected store: CircStoreInterface;
    protected engine: EngineInterface;

    constructor(store: CircStoreInterface, engine: EngineInterface) {
        this.store = store;
        this.engine = engine;
    }

    public render(): DocumentFragment {

        const engineFragment = document.createDocumentFragment();

        return engineFragment;
    }

    protected makeSaveFragment(): DocumentFragment {
        const html = `<button class="save">Save</button>`;

        const fragment = document.createRange().createContextualFragment(html);

        fragment.querySelector('button.save').addEventListener('click', e => {
            const name = prompt('Enter Circ name');
            const circ = this.engine.export();
            circ.name = name;

            this.store.store(name, circ);
        });

        return fragment;
    }

    protected makeLoadFragment(): DocumentFragment {
        const html = `<button class="load">Load</button>`;

        const fragment = document.createRange().createContextualFragment(html);

        fragment.querySelector('button.load').addEventListener('click', e => {
            const storeFront = <HTMLElement>document.querySelector('.store');
            const storeListing = storeFront.querySelector('.listing');
            storeListing.innerHTML = '';

            this.store.list().forEach((circ: CircInterface) => {
                const tile = document.createRange().createContextualFragment(`<div class="circ" data-name="${circ.name}">${circ.name}</div>`);

                tile.querySelector('.circ').addEventListener('click', e => {
                    this.engine.import(this.store.get((e.target as HTMLElement).getAttribute('data-name')));
                    storeFront.style.display = 'none';
                });

                storeListing.appendChild(tile);
            });

            storeFront.style.display = 'block';
        });

        return fragment;
    }

    public getQuickControls(): ControlInterface[] {
        const self = this;

        return [
            new class implements ControlInterface {
                render(): DocumentFragment {
                    return self.makeSaveFragment();
                }
            },
            new class implements ControlInterface {
                render(): DocumentFragment {
                    return self.makeLoadFragment();
                }
            },
        ];
    }

}
