<template>
  <div>
    <div class="wrap">
      <div class="mes" :class="{'owner': owner}">
        <p>{{text}}</p>
        <p class="time">{{new Date(time).toLocaleString()}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    text: String,
    owner: {
      type: Boolean,
      default: false
    },
    time: Number
  }
};
</script>

<style lang="stylus" scoped>
.system {
  margin-bottom: 1rem;

  p {
    margin-bottom: 1rem;
  }
}

.wrap {
  display: flex;
  flex-direction: column;
}

.mes {
  padding: 1rem;
  width: 60%;
  margin: 0 1rem;
  box-shadow: 0 1px 0 0 rgba(50, 50, 50, 0.3);
  border-radius: 4px;
  background: #1976d2;
  position: relative;
  margin-bottom: 1rem;
  display flex
  flex-direction column
  gap 10px 0

  p {
    margin-bottom: 0;
  }

  .time {
    align-self flex-end
  }
}

.owner {
  background: #ffffff;
  color: #000000;
  align-self: flex-end;
}
</style>

