/* RoboticsButton: A button shown below the filters that goes to /learn2016/robotics.
 */

import React from 'react';
import { getItemValue } from './responsive';

const styles = {
  roboticsButtonImage: {
    marginTop: 10,
    marginBottom: 20
  },
  roboticsText: {
    float: "left",
    margin: 5,
    padding: 5,
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: "#eee"
  }
};

const RoboticsButton = (props) => (
  <div style={{float:"left"}}>
    <div style={{display: getItemValue({md: "block", xs: "none"})}}>
      <a href="/learn2016/robotics">
        <img src="/images/learn/robotics-link.png" style={styles.roboticsButtonImage}/>
      </a>
    </div>
    <div style={{...styles.roboticsText, display: getItemValue({xs: "block", md: "none"})}}>
      Got robots? <a href="/learn2016/robotics">Use these activities</a> and make a tangible Hour of Code for students of any age!
    </div>
  </div>
);

export default RoboticsButton;
