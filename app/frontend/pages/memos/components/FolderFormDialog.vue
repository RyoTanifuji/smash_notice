<template>
  <v-card>
    <v-card-title class="ma-2">
      <span class="text-h5 font-weight-bold"><slot name="title" /></span>
    </v-card-title>
    <v-card-text>
      <TheAlert :is-dialog="true" />
      <form @submit.prevent>
        <v-text-field
          v-model="v$.folder.name.$model"
          :error-messages="v$.folder.name.$errors.map(e => e.$message)"
          :counter="30"
          name="フォルダ名"
          label="フォルダ名"
          hint="未入力の場合、下記の使用ファイター名が設定されます"
          variant="underlined"
        />
        <v-autocomplete
          v-model="v$.folder.fighterId.$model"
          :error-messages="v$.folder.fighterId.$errors.map(e => e.$message)"
          :items="fightersArray"
          item-value="id"
          item-title="name"
          clearable
          :menu-props="{ location: 'top', scrollStrategy: 'none' }"
          name="使用ファイター"
          label="使用ファイター"
          hint="自分の使用ファイターを選択してください"
          variant="underlined"
        />
      </form>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn @click="handleCloseFolderFormDialog">
        キャンセル
      </v-btn>
      <v-btn
        class="mr-4"
        color="teal-accent-4"
        @click="handleFolderSubmit"
      >
        <slot name="submit" />
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { useVuelidate } from '@vuelidate/core';
import {
  required,
  maxLength,
  helpers
} from '@vuelidate/validators';
import { requiredMessage, maxLengthMessage } from '../../../constants/validationCustom';
import { FIGHTERS_ARRAY } from '../../../constants/fightersArray';
import TheAlert from '../../../components/TheAlert';

export default {
  name: "FolderFormDialog",
  components: {
    TheAlert
  },
  props: {
    folder: {
      type: Object,
      required: true,
      id: {
        type: Number,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      fighterId: {
        type: Number,
        required: true
      }
    }
  },
  emits: [
    "close-dialog",
    "folder-submit"
  ],
  setup() {
    return {
      v$: useVuelidate()
    };
  },
  data() {
    return {
      fightersArray: FIGHTERS_ARRAY
    };
  },
  validations () {
    return {
      folder: {
        name: {
          maxLength: helpers.withMessage(maxLengthMessage(30), maxLength(30))
        },
        fighterId: {
          required: helpers.withMessage(requiredMessage("使用ファイター"), required)
        }
      }
    };
  },
  methods: {
    handleCloseFolderFormDialog() {
      this.v$.$reset();
      this.$emit("close-dialog");
    },
    async handleFolderSubmit() {
      const result = await this.v$.$validate();

      if (!result) return;

      this.$emit("folder-submit", this.folder);
    }
  }
};
</script>