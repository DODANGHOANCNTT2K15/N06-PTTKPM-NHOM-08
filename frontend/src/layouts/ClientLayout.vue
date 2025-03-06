<template>
<div>
    <HeaderComponent />
    <router-view />
    <FooterComponent />
</div>
</template>

<script>
import HeaderComponent from '@/components/client/HeaderComponent.vue';
import FooterComponent from '@/components/client/FooterComponent.vue';

export default {
    components: {
        HeaderComponent,
        FooterComponent
    }
};
</script>

<style>
* {
    font-family: 'Roboto', sans-serif;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

main{
    background-color: rgb(194, 217, 243);
}

.flex{
    display: flex;
}

.hidden{
    display: none !important;
}
</style>
  