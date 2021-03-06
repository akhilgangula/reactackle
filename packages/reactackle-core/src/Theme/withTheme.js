import React, { Component } from 'react';
import PropTypes from 'prop-types';
import hoistNonReactMethods from 'hoist-non-react-methods';
import { extractThemeOrDefault } from '../theme';

const CHANNEL = '__styled-components__';

const contextTypes = {
  [CHANNEL]: PropTypes.func,
};

function isClassComponent(Component) {
  return Boolean(
      Component &&
      Component.prototype &&
      Component.prototype.isReactComponent,
  );
}

export const withTheme = WrappedComponent => {
  const isStatefull = isClassComponent(WrappedComponent);

  class WithTheme extends Component {
    constructor(props) {
      super(props);

      this.state = {
        theme: {},
      };

      this._unsubscribe = null;
    }

    componentWillMount() {
      if (this.context[CHANNEL]) {
        const subscribe = this.context[CHANNEL];

        this._unsubscribe = subscribe(theme => {
          this.setState({ theme });
        });
      }
    }

    componentWillUnmount() {
      if (this._unsubscribe) this._unsubscribe();
    }

    render() {
      const theme = extractThemeOrDefault(this.state.theme);

      const props = {
        ...this.props,
        theme,
      };

      if (isStatefull) props.ref = ref => { this.wrappedComponent = ref; };

      return (
        <WrappedComponent
          {...props}
        />
      );
    }
  }

  WithTheme.contextTypes = contextTypes;
  WithTheme.displayName = `WithTheme(${WrappedComponent.displayName})`;

  WithTheme.propTypes = {
    ...WrappedComponent.propTypes,
    theme: PropTypes.object,
  };

  WithTheme.defaultProps = {
    ...WrappedComponent.defaultProps,
  };

  return isStatefull
    ? hoistNonReactMethods(
      WithTheme,
      WrappedComponent,
      c => c.wrappedComponent,
    )
    : WithTheme;
};
