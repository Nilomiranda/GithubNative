import React, { Component } from 'react';
import { TouchableWithoutFeedback, RefreshControl } from 'react-native';
import PropTypes from 'prop-types';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  Loading,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func.isRequired,
      navigate: PropTypes.func.isRequired,
    }).isRequired,
  };

  state = {
    stars: [],
    loading: false,
    page: 1,
  };

  async componentDidMount() {
    const { navigation } = this.props;
    const { page } = this.state;
    const user = navigation.getParam('user');

    this.setState({ loading: true });
    const response = await api.get(`users/${user.login}/starred?page=${page}`);

    this.setState({ stars: response.data, loading: false });
  }

  handleNavigation = item => {
    const { navigation } = this.props;

    navigation.navigate('Repository', { item });
  };

  handleEndOFList = async () => {
    const { page, stars } = this.state;
    const { navigation } = this.props;
    const user = navigation.getParam('user');

    const newPage = page + 1;

    const response = await api.get(
      `users/${user.login}/starred?page=${newPage}`
    );

    this.setState({ stars: [...stars, ...response.data], page: newPage });
  };

  handleRefreshing = async () => {
    this.setState({ loading: true });
    const { navigation } = this.props;
    const user = navigation.getParam('user');

    const response = await api.get(`users/${user.login}/starred`);

    this.setState({ stars: response.data, loading: false });
  };

  render() {
    const { stars, loading } = this.state;
    const { navigation } = this.props;
    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        {loading ? (
          <Loading>Loading starred repositories...</Loading>
        ) : (
          <Stars
            data={stars}
            keyExtractor={star => String(star.id)}
            onEndReachedThreshold={0.2}
            onEndReached={this.handleEndOFList}
            renderItem={({ item }) => (
              <TouchableWithoutFeedback
                onPress={() => this.handleNavigation(item)}
              >
                <Starred>
                  <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                  <Info>
                    <Title>{item.name}</Title>
                    <Author>{item.owner.login}</Author>
                  </Info>
                </Starred>
              </TouchableWithoutFeedback>
            )}
            refreshing={loading}
            onRefresh={this.handleRefreshing}
          />
        )}
      </Container>
    );
  }
}
