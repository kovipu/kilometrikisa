<script lang="ts">
  const clientId = '84299';
  const redirectUri = 'https://kilometrikisa.fly.dev/strava/oauth-callback';
  const scope = 'activity:read';
  const loginUri = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
</script>

<a href={loginUri}>Tunnistaudu Stravaan</a>

<style lang="scss">
  a {
    text-decoration: none;
    color: #0042cc;

    &:hover {
      text-decoration: underline;
    }
  }
</style>
