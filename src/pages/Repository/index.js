import React from 'react';
import { WebView } from 'react-native-webview';
import PropTypes from 'prop-types';

function Repository({ navigation }) {
  return <WebView source={{ uri: navigation.getParam('item').html_url }} />;
}

Repository.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('item').name,
});

Repository.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func.isRequired,
  }).isRequired,
};

export default Repository;
