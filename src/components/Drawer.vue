<script setup>
  import axios from 'axios';
  import { ref,inject,computed } from 'vue';
  import DrawerHead from './DrawerHead.vue';
  import CartItemList from './CartItemList.vue';
  import InfoBlock from './InfoBlock.vue';




  const props = defineProps({
    totalPrice: Number,
    vatPrice: Number,

  })

  const {
    cart,
    closeDrawer
  } = inject('cart')

  const isCreating = ref(false)
  const orderId = ref(null)

  const createOrder = async() => {
    try{
      isCreating.value = true
      const { data } = await axios.post(`https://4d52dc6e33fee8ad.mokky.dev/orders`,{
        items: cart.value,
        totalPrice: props.totalPrice
      })

      cart.value.forEach(item => {
        localStorage.removeItem(`cartState_${item.id}`);
      });

      cart.value = [];
      orderId.value = data.id
    } catch(err){
      console.log(err)
    } finally {
      isCreating.value = false
    }
  }

  const cartIsEmpty = computed(() => cart.value.length === 0)
  const buttonDisabled = computed(() => isCreating.value || cartIsEmpty.value)

</script>

<template>
  <div class="fixed top-0 left-0 h-full w-full bg-black z-10 opacity-70 "></div>
  <div class=" bg-white w-96 h-full fixed right-0 top-0 z-20 p-8 ">
    <DrawerHead />


    <div v-if="!totalPrice || orderId" class="flex h-full items-center">
      <InfoBlock
        v-if="!totalPrice && !orderId"
        title="корзина пуста"
        description="добавьте хотя бы одну пару кросовок,чтобы зделать заказ."
        image-url="package-icon.png"
      />

      <InfoBlock
        v-if="orderId"
        title="Заказ оформлен"
        :description="`Ваш заказ № ${orderId} скоро будет передан курьеру.`"
        image-url="/order-success-icon.png"
      />
    </div>

    <CartItemList v-if="totalPrice"
    />

    <div v-if="totalPrice" class="flex flex-col gap-4 mt-7">
      <div class="flex gap-2 ">
        <span>total:</span>
        <div class="flex-1 border-b border-dashed"></div>
        <b>{{ totalPrice }} pyb</b>
      </div>

      <div class="flex gap-2 ">
        <span>fee 5%:</span>
        <div class="flex-1 border-b border-dashed"></div>
        <b>{{ vatPrice }}pyb</b>
      </div>

      <button
        :disabled="buttonDisabled"
        @click="createOrder"
        class="mt-4 transition bg-lime-500 w-full rounded-xl py-3 text-white disabled:bg-slate-400 hover:bg-lime-600 active:bg-lime-700 cursor-pointer">
        оформить заказ
      </button>
    </div>

  </div>
</template>



