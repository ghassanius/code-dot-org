/* global dashboard */

import React from 'react';

import * as rowStyle from './rowStyle';
import {singleton as studioApp} from '../../StudioApp';

// We'd prefer not to make GET requests every time someone types a character.
// This is the amount of time that must pass between edits before we'll do a GET
// I expect that the vast majority of time, people will be copy/pasting URLs
// instead of typing them manually, which will result in an immediate GET,
// unless they pasted within USER_INPUT_DELAY ms of editing the field manually
var USER_INPUT_DELAY = 1500;

var ImagePickerPropertyRow = React.createClass({
  propTypes: {
    initialValue: React.PropTypes.string.isRequired,
    handleChange: React.PropTypes.func,
    desc: React.PropTypes.node,
  },

  componentDidMount() {
    this.isMounted_ = true;
  },

  componentWillUnmount() {
    this.isMounted_ = false;
  },

  getInitialState: function () {
    return {
      value: this.props.initialValue,
      lastEdit: 0
    };
  },

  changeUnlessEditing: function (filename) {
    if (Date.now() - this.state.lastEdit >= USER_INPUT_DELAY) {
      this.changeImage(filename);
    }
  },

  handleChangeInternal: function (event) {
    var filename = event.target.value;
    this.changeUnlessEditing(filename);

    this.setState({
      value: filename,
      lastEdit: Date.now()
    });

    // We may not have changed file yet (if we still actively editing)
    setTimeout(function () {
      this.changeUnlessEditing(this.state.value);
    }.bind(this), USER_INPUT_DELAY);
  },

  handleButtonClick: function () {
    // TODO: This isn't the pure-React way of referencing the AssetManager
    // component. Ideally we'd be able to `require` it directly without needing
    // to know about `designMode`.
    //
    // However today the `createModalDialog` function and `Dialog` component
    // are intertwined with `StudioApp` which is why we have this direct call.
    dashboard.assets.showAssetManager(this.changeImage, 'image', null, {
      showUnderageWarning: !studioApp.reduxStore.getState().pageConstants.is13Plus
    });
  },

  changeImage: function (filename) {
    this.props.handleChange(filename);
    // Because we delay the call to this function via setTimeout, we must be sure not
    // to call setState after the component is unmounted, or React will warn and
    // tests will fail.
    if (this.isMounted_) {
      this.setState({value: filename});
    }
  },

  render: function () {
    return (
      <div style={rowStyle.container}>
        <div style={rowStyle.description}>{this.props.desc}</div>
        <div>
          <input
            value={this.state.value}
            onChange={this.handleChangeInternal}
            style={rowStyle.input}
          />
          &nbsp;
          <a onClick={this.handleButtonClick}>
            Choose...
          </a>
        </div>
      </div>
    );
  }
});

export default ImagePickerPropertyRow;
