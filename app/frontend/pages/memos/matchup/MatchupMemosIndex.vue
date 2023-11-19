<template>
  <div class="text-h3 font-weight-bold">
    キャラ対メモ
  </div>

  <div class="my-10" />

  <template v-if="false">
  </template>

  <template v-else>
    <div class="text-body-1 font-weight-bold">
      まだ、フォルダがありません<br>
    </div>

    <div class="my-8" />

    <div class="text-body-1 font-weight-bold">
      ファイターの追加から自分の使用ファイターを選択して、フォルダを追加しましょう
    </div>

    <div class="my-8" />

    <div>
      <v-dialog
        v-model="dialog"
        width="700px"
      >
        <template #activator="{ props }">
          <v-row class="mx-16 mt-5">
            <v-btn
              color="indigo-accent-4"
              v-bind="props"
            >
              ファイターの追加
            </v-btn>
          </v-row>
        </template>
        <v-card>
          <v-card-title class="ma-2">
            <span class="text-h5 font-weight-bold">ファイターの追加</span>
          </v-card-title>
          <v-card-text>
            <form>
              <v-text-field
                v-model="v$.folder.name.$model"
                :error-messages="v$.folder.name.$errors.map(e => e.$message)"
                :counter="20"
                name="フォルダ名"
                label="フォルダ名"
                placeholder="未入力の場合、自分の使用ファイター名が設定されます"
                variant="underlined"
              />
              <v-autocomplete
                v-model="v$.folder.fighterId.$model"
                :error-messages="v$.folder.fighterId.$errors.map(e => e.$message)"
                :items="fightersArray"
                item-value="id"
                item-title="name"
                clearable
                name="使用ファイター"
                label="使用ファイター"
                placeholder="自分の使用ファイターを選択してください"
                variant="underlined"
              />
            </form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn @click="handleCloseFolderDialog">
              キャンセル
            </v-btn>
            <v-btn
              class="mr-4"
              color="indigo-accent-4"
              @click="handleCreateFolder"
            >
              作成
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </template>
</template>

<script>
import { useVuelidate } from '@vuelidate/core';
import { mapActions } from 'vuex';
import {
  required,
  maxLength,
  helpers
} from '@vuelidate/validators';
import {
  requiredMessage,
  maxLengthMessage
} from '../../../plugins/validationMessages';
import {
  serverErrorAlertStatus
} from '../../../plugins/alertStatus';
import { FIGHTERS_ARRAY } from '../../../plugins/fightersArray';

export default {
  name: "MatchupMemosIndex",
  inject: ["$axios"],
  setup() {
    return {
      v$: useVuelidate()
    };
  },
  data() {
    return {
      dialog: false,
      folder: {
        name: "",
        type: "MatchupFolder",
        fighterId: null
      },
      fightersArray: FIGHTERS_ARRAY
    };
  },
  validations () {
    return {
      folder: {
        name: { 
          maxLength: helpers.withMessage(maxLengthMessage(20), maxLength(20))
        },
        fighterId: {
          required: helpers.withMessage(requiredMessage("使用ファイター"), required)
        }
      }
    };
  },
  methods: {
    ...mapActions("memos", ["createFolder"]),
    async handleCreateFolder() {
      const result = await this.v$.$validate();

      if (!result) return;

      try {
        await this.createFolder(this.folder);
      } catch (error) {
        this.displayAlert(serverErrorAlertStatus);
      }
      this.handleCloseFolderDialog();
    },
    handleCloseFolderDialog() {
      this.folder.name = "";
      this.folder.fighterId = null;
      this.v$.$reset();
      this.dialog = false;
    }
  }
};
</script>