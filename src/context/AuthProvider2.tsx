import React from 'react';
import { usePrevious } from './usePrevious';
import { AuthContext } from './AuthContext2';

export type AuthProviderProps = {
  defaultAuthenticated?: boolean;
  onLogin?: () => void;
  onLogout?: () => void;
};

/**
 * Calling setState in componentDidUpdate causes 
 * on more render just for the state change.
 * The componentWillUpdate provides max. flexibility
 * but React suggests to use getDerivedStateFromProps().
 */
class AuthProvider extends React.Component<{}, AuthProviderProps> {
    /*
    public static defaultProps: AuthProviderProps = {
        defaultAuthenticated = false,
        onLogout,
        onLogout,
        children,
    }; */

    constructor(props: AuthProviderProps){
        super(props);

        this.state = {
            defaultAuthenticated: props.defaultAuthenticated ?? false, 
            onLogin: props.onLogin, 
            onLogout: props.onLogout
        }

        //this.state = { defaultAuthenticated !== undefined ? defaultA :  false }
        //const [authenticated, setAuthenticated] = React.useState(this.state.defaultAuthenticated);
    }

    componentWillMount() {
        // nothing
    }

    componentDidMount() {
        let previousAuthenticated = usePrevious(this.state.defaultAuthenticated);
        if (!previousAuthenticated && this.state.defaultAuthenticated) {
            this.state.onLogin && this.state.onLogin();
        }

        if (previousAuthenticated && !this.state.defaultAuthenticated) {
            this.state.onLogout && this.state.onLogout();
        }
    }

    /**
     * Invoking setState() in componentDidUpdate() triggers rendering cycle.
     */
    componentDidUpdate() {
        let previousAuthenticated = usePrevious(this.state.defaultAuthenticated);
        if (!previousAuthenticated && this.state.defaultAuthenticated) {
            this.state.onLogin && this.state.onLogin();
        }

        if (previousAuthenticated && !this.state.defaultAuthenticated) {
            this.state.onLogout && this.state.onLogout();
        }

        //const iwas = React.useMemo(() => ({authenticated, setAuthenticated}),[authenticated]);
    }

    componentWillUnmount() {
        //
    }

    /**
     * Use shouldComponentUpdate() as a check if an update
     * and rendering cycle is needed.
     * @param nextProps 
     * @param nextState 
     */
    shouldComponentUpdate(nextProps: {}, nextState: AuthProviderProps) {
        //return true;
        return this.state.defaultAuthenticated !== nextState.defaultAuthenticated;
    }

    static getDerivedStateFromProps(props: AuthProviderProps, state: any) {
        /*
        if (props.currentRow !== state.lastRow) {
          return {
            isScrollingDown: props.currentRow > state.lastRow,
            lastRow: props.currentRow,
          };
        }
        */
        // return null to indicate no change to state
        return null;
    }

    render() {
        const contextValue = React.useMemo(() => ({}), [])
        return (
            //<AuthContext.Provider value={contextValue}>{this.props.children}</AuthContext.Provider>
            <div></div>
        );
    }
}
