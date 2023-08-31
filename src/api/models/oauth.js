import { AccessToken } from "./access-token.js";
import { AuthCode } from "./auth-code.js";
import { Client } from "./client.js";
import { User } from "./user.js";

export const OAuth = {
  getAccessToken: async (accessToken) => {
    const _accessToken = await AccessToken.findOne({ accessToken })
      .populate("user")
      .populate("client");

    if (!_accessToken) return false;

    _accessToken = _accessToken.toObject(); //TODO: Actualizar sintaxis

    if (!_accessToken.user) _accessToken.user = {};

    return _accessToken;
  },
  getRefreshToken: (refreshToken) => {
    return AccessToken.findOne({ refreshToken })
      .populate("user")
      .populate("client");
  },
  getAuthorizationCode: (code) => {
    return AuthCode.findOne({ authorizationCode: code })
      .populate("user")
      .populate("client");
  },
  getClient: (clientId, clientSecret) => {
    const params = { clientId };
    if (clientSecret) params.clientSecret = clientSecret;
    return Client.findOne(params);
  },
  getUser: async (username, password) => {
    const user = await User.findOne({ username });
    if (user.validatePassword(password)) return user;
    return false;
  },
  getUserFromClient: (client) => {
    return User.findById(client.user);
    // return {};
  },
  saveToken: async (token, client, user) => {
    const accessToken = (
      await AccessToken.create({
        user: user.id || null,
        client: client.id,
        accessToken: token.accessToken,
        accessTokenExpiresAt: token.accessTokenExpiresAt,
        refreshToken: token.refreshToken,
        refreshTokenExpiresAt: token.refreshTokenExpiresAt,
        scope: token.scope,
      })
    ).toObject();

    if (!accessToken.user) accessToken.user = {};

    return accessToken;
  },
  saveAuthorizationCode: (code, client, user) => {
    const authCode = new AuthCode({
      user: user.id,
      client: client.id,
      authorizationCode: code.authorizationCode,
      expiresAt: code.expiresAt,
      scope: code.scope,
    });

    return authCode.save();
  },
  revokeToken: async (accessToken) => {
    const result = await AccessToken.deleteOne({
      refreshToken: accessToken.refreshToken,
    });
    return result.deletedCount > 0;
  },
  revokeAuthorizationCode: async (code) => {
    const result = await Code.deleteOne({
      authorizationCode: code.authorizationCode,
    });
    return result.deletedCount > 0;
  },
};
