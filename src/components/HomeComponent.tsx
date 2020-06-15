import React from 'react';

interface State {
}

interface Props {
}

export class HomeComponent extends React.Component<Props> {
    
    constructor(props: Props){
        super(props);
    }

    render(){
        return (
            <div>
                <h2>Welcome</h2>
                <p>Lorem ipsum</p>
            </div>
           //<div></div>
        );
    }
}
