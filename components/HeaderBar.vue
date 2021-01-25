<template>
  <b-navbar toggleable="lg" type="dark" variant="info">
    <b-navbar-brand to="/">
      SD
    </b-navbar-brand>

    <b-navbar-toggle target="nav-collapse" />
    <b-navbar-nav>
      <b-nav-item href="#">
        Link
      </b-nav-item>
      <b-nav-item href="#" disabled>
        Disabled
      </b-nav-item>
    </b-navbar-nav>
    <b-collapse id="nav-collapse" is-nav />
  </b-navbar>
</template>
