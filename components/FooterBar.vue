<template>
    <footer class="footer blog-footer py-3">
        <b-container>
            <span class="text-muted">Copyright &copy; 2020-{{ currentYear }},&nbsp;&nbsp;Jonathan Twite</span>
        </b-container>
    </footer>
</template>

<script>
import { BContainer } from 'bootstrap-vue';
import dayjs from '~/node_modules/dayjs';

export default {
    components: {
        BContainer
    },
    data() {
        return {
            currentYear: 0
        };
    },
    created() {
        this.currentYear = dayjs().year();
    }
};
</script>
