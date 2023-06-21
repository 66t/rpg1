interface LoadSrc {
    src: string;
    data?: (LoadSrc | { src: string; data?: LoadSrc[] })[];
}
namespace LIM {
    export let module: LoadSrc[] = [
        {src:"js",
            data:[
                {src:"libs",data:[
                        {src:"pixi"},{src:"pixi-filters"},{src:"pixi-tilemap"},{src:"pixi-picture"},
                        {src:"fpsmeter"},{src:"crypto-js.min"},{src:"iphone-inline-video.browser"},{src:"pizzicato"}]},
                {src:"rpg_core"},{src:"rpg_managers"},{src:"rpg_objects"},{src:"rpg_scenes"},{src:"rpg_sprites"},{src:"rpg_windows"},
                {src:"plugins"},
                {src:"module",data:[
                        {src:"00-utils",data:[{src:"01-string"},{src:"02-math"},{src:"03-algorithm"},{src:"04-keyInput"},{src:"05-filter"}]},
                        {src:"01-storage",data:[{src:"01-main"},{src:"02-save"},{src:"03-boolean"},{src:"04-number"},{src:"05-story"}]},
                        {src:"02-audio",data:[{src:"01-conductor"},{src:"02-musical"}]},
                        {src:"04-scene",data:[{src:"01-scene"},{src:"02-vessel"},{src:"03-window"},{src:"04-command"},{src:"05-shape"}]},
                        {src:"05-story",data:[{src:"01-role"},{src:"02-console"}]},
                        {src:"10-rogue",data:[{src:"01-main"},{src:"02-room"}]}
                    ]}]
        },
        {src:"event",data:[{src:"event1"}]},
        {src:"main"}
    ];
    export namespace moduleManager {
        export let _path: string = "";
        export let _scripts: string[] = [];
        export let _errorUrls: string[] = [];
        export function setup(modules: LoadSrc[], src: string): void {
            modules.forEach((module) => {
                if (module.data) setup(module.data, `${src}/${module.src}`);
                else {
                    let name = `${src}/${module.src}.js`;
                    loadScript(name);
                    _scripts.push(name);
                }
            });
        }
        export function loadScript(url: string): void {
            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;
            script.async = false;
            script.onerror = onError.bind(this);
            (script as any)._url = url;
            document.body.appendChild(script);
        }
        export function checkErrors(): void {
            let url = _errorUrls.shift();
            if (url) {
                throw new Error('Failed to load: ' + url);
            }
        }
        export function onError(e: Event): void {_errorUrls.push((e.target as any)._url);}
        setup(module, moduleManager._path);
    }
}