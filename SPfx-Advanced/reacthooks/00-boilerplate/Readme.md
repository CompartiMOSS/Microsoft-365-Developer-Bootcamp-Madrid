# 00 boilerplate
Punto para empezar el resto de ejemplos.
Solo es una solución en blanco usando Yeoman y seleccionando ReactJs como Framework.
```bash
yo @microsoft/sharepoint
```

Dentro de la carpeta "src/Webparts/{nombredelwebpart}" crearemos una carpeta llamada hooks. 

A continuación lo que vamos a realizar es modificar el componente que deja de serie y cambiarlo por un componente funcional para ello podemos poner el siguiente código

```javascript
import * as React from 'react';
import styles from './ReactHooks.module.scss';
import { IReactHooksProps } from './IReactHooksProps';

export default class ReactHooks extends React.Component<IHooksProps, {}> {
  public render(): React.ReactElement<IHooksProps> {
    return (
       <div className={ styles.reactHooks }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>Welcome to SharePoint!</span>
              <p className={ styles.subTitle }>Customize SharePoint experiences using Web Parts.</p>
              <p className={ styles.description }>{escape(this.props.description)}</p>
              <a href="https://aka.ms/spfx" className={ styles.button }>
                <span className={ styles.label }>Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
```

Ojo: El nombre de la función se debe de llamar igual que la clase que habia previamente, en caso de que lo queramos llamar de forma diferente tendremos que modificar el fichero donde arranca la solución de Spfx-


