<template>
    <div class="notebook-paper">
        <b-container class="bg-white page">
            <HeaderBar />

            <Nuxt />
        </b-container>
    </div>
</template>

<style>
.notebook-paper {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(to bottom, white 29px, rgba(0, 176, 215, 0.1) 1px);
  background-size: 100% 30px;
  position: relative;
  background-attachment: fixed;
  overflow: hidden;
  border-radius: 5px;
  -webkit-box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.2), 0px 0px 6px rgba(0, 0, 0, 0.2);
  -moz-box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.2), 0px 0px 6px rgba(0, 0, 0, 0.2);
  -ms-box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.2), 0px 0px 6px rgba(0, 0, 0, 0.2);
  -o-box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.2), 0px 0px 6px rgba(0, 0, 0, 0.2);
  box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.2), 0px 0px 6px rgba(0, 0, 0, 0.2);
  z-index: 0;
}
.notebook-paper:before {
  content: "";
  display: block;
  position: absolute;
  top: 0;
  left: 140px;
  height: 100%;
  width: 1px;
  background: #db4034;
  opacity: 0.3;
}

.page::before,
.page::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  box-shadow: 0 5px 14px rgba(0,0,0,.7);
  background: #fff;
  transition: all .3s ease-in-out;
}
.page::before {
  transform: rotate(1deg);
  z-index: -1;
}

.page::after {
  transform: rotate(2deg);
  z-index: -2;
}

.page {
  position: relative;
  background: #fff;
  border-radius: 2px;
  border-left: 1px solid #eee;
  border-right: 1px solid #eee;
  border-top: 1px solid #eee;
  margin-top: 3rem;
  box-shadow: 0 3px 7px rgba(0,0,0,.7);
}
</style>
