<template>
    <div>
        <h1>{{ regionname }}</h1>
        <p>{{regionname}}입니다</p>
    </div>
</template>

<script>
export default {
    computed: {
        regionname() {
            return this.$route.params.name;
        }
    },
}
</script>