import BackButton from '@/components/BackButton';
import Button from '@/components/Button';
import DeleteButton from '@/components/DeleteButton';
import Header from '@/components/Header';
import ImageUpload from '@/components/ImageUpload';
import Input from '@/components/Input';
import ModalWrapper from '@/components/ModalWrapper';
import Typo from '@/components/Typo';
import { expenseCategories, transactionTypes } from '@/constants/mockData';
import { radius, spacingX, spacingY } from '@/constants/theme';
import { useAuth } from '@/contexts/authContext';
import useFetchData from '@/hooks/useFetchData';
import useThemeColors from '@/hooks/useThemeColors';
import { createOrUpdateTransaction, deleteTransaction } from '@/services/transactionService';
import { TransactionType, WalletType } from '@/types';
import { scale, verticalScale } from '@/utils/styling';
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { orderBy, where } from 'firebase/firestore';
import * as Icons from 'phosphor-react-native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { SafeAreaView } from 'react-native-safe-area-context';

const TransactionModal = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  // colors hook
  const colors = useThemeColors();
  const router = useRouter();

  const { t, i18n } = useTranslation();

  const [transaction, setTransaction] = useState<TransactionType>({
    type: 'expense',
    amount: 0,
    description: "",
    category: "",
    date: new Date(),
    walletId: "",
    image: null
  })
  const {
    data: wallets
  } = useFetchData<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc")
  ]);

  type paramType = {
    id: string,
    type: string,
    amount: string,
    category?: string,
    date: string,
    description?: string,
    image?: any,
    uid: string,
    walletId: string
  };

  const oldTransaction: paramType = useLocalSearchParams();

  const onDateChange = (event: DateTimePickerEvent, selectedDate: any) => {
    const currentDate = selectedDate || transaction.date;
    setTransaction({ ...transaction, date: currentDate });
    setShowDatePicker(Platform.OS === 'ios');
  };

  useEffect(() => {
    if (oldTransaction?.id) {
      setTransaction({
        type: oldTransaction?.type,
        amount: Number(oldTransaction?.amount),
        description: oldTransaction?.description || "",
        category: oldTransaction?.category || "",
        date: new Date(oldTransaction?.date),
        walletId: oldTransaction?.walletId,
        image: oldTransaction?.image,
      });
    }
  }, []);

  const onSubmit = async () => {
    const { type, amount, description, category, date, walletId, image } = transaction;
    if (!walletId || !date || !amount || amount <= 0 || (type === "expense" && !category)) {
      Alert.alert(t("transaction_001"), t("transaction_002"));
      return;
    }

    let transactionData: TransactionType = {
      type,
      amount,
      description,
      category,
      date,
      walletId,
      image: image || null,
      uid: user?.uid
    };

    if (oldTransaction?.id) transactionData.id = oldTransaction.id;

    setLoading(true);
    const resp = await createOrUpdateTransaction(transactionData);
    setLoading(false);

    if (resp.success) {
      router.back();
    } else {
      Alert.alert(t("transaction_001"), resp.msg);
    }
  };

  const onTransactionDelete = async () => {
    if (!oldTransaction?.id) return;
    setLoading(true);
    const res = await deleteTransaction(oldTransaction?.id, oldTransaction?.walletId);
    setLoading(false);

    if (res.success) {
      router.back();
    } else {
      Alert.alert(t("transaction_010"), res.msg);
    }
  };

  const deletWalletAlert = () => {
    Alert.alert(t("transaction_003"), t("transaction_004") , [
      { text: t("transaction_005"), style: 'cancel' },
      { text: t("transaction_006"), onPress: onTransactionDelete, style: 'destructive' }
    ]);
  };

  return (
    <ModalWrapper>
      <SafeAreaView
      style={{ flex: 1 }}
      edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 30 : 0}>
          <View style={{ flex: 1 }}>
            <ScrollView
              contentContainerStyle={styles.form} 
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled={true}
              scrollEnabled={true}
              bounces={true}
              alwaysBounceVertical={false}
              onScrollBeginDrag={Keyboard.dismiss}
              scrollEventThrottle={16}>

                <Header
                  title={oldTransaction?.id ? t("transaction_007") : t("transaction_008")}
                  leftIcon={<BackButton />}
                  style={{ marginBottom: spacingY._10 }}
                />

                {/* Transaction Type */}
                <View style={styles.inputContainer}>
                  <Typo color={colors.neutral100} size={16} fontWeight={"500"}>{t("transaction_009")}</Typo>
                  <Dropdown
                    style={[styles.dropdownContainer, { borderColor: colors.neutral300}]}
                    selectedTextStyle={[styles.dropdownSelectedText, { color: colors.text}]}
                    iconStyle={[styles.dropdownIcon,{tintColor: colors.neutral300}]}
                    data={transactionTypes}
                    maxHeight={200}
                    labelField="label"
                    valueField="value"
                    itemTextStyle={{ color: colors.text }}
                    itemContainerStyle={styles.dropdownItemContainer}
                    containerStyle={[styles.dropdownListContainer, {borderColor: colors.neutral500,shadowColor: colors.black, backgroundColor: colors.neutral900,                      }]}
                    activeColor={colors.primarySelection}
                    value={transaction.type}
                    onChange={(item) => setTransaction({ ...transaction, type: item.value })}
                  />
                </View>

                {/* Wallet */}
                <View style={styles.inputContainer}>
                  <Typo color={colors.neutral200} size={16} fontWeight={"500"}>{t("transaction_010")}</Typo>
                  <Dropdown
                    style={[styles.dropdownContainer, { borderColor: colors.neutral300}]}
                    placeholder={"Select wallet"}
                    placeholderStyle={{ color: colors.text }}
                    selectedTextStyle={[styles.dropdownSelectedText, { color: colors.text}]}
                    iconStyle={[styles.dropdownIcon,{tintColor: colors.neutral300}]}
                    data={wallets.map((wallet) => ({
                      label: `${wallet?.name} ($${wallet.amount})`,
                      value: wallet?.id
                    }))}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    itemTextStyle={{ color: colors.text }}
                    itemContainerStyle={styles.dropdownItemContainer}
                    containerStyle={[styles.dropdownListContainer, {borderColor: colors.neutral500,shadowColor: colors.black, backgroundColor: colors.neutral900,                      }]}
                    activeColor={colors.primarySelection}
                    value={transaction.walletId}
                    onChange={(item) => setTransaction({ ...transaction, walletId: item.value || "" })}
                  />
                </View>

                {/* Expense Category */}
                {transaction.type === "expense" && (
                  <View style={styles.inputContainer}>
                    <Typo color={colors.neutral200} size={16} fontWeight={"500"}>{t("transaction_011")}</Typo>
                    <Dropdown
                      style={[styles.dropdownContainer, { borderColor: colors.neutral300}]}
                      placeholder={"Select category"}
                      placeholderStyle={{ color: colors.text }}
                      selectedTextStyle={[styles.dropdownSelectedText, { color: colors.text}]}
                      iconStyle={[styles.dropdownIcon,{tintColor: colors.neutral300}]}
                      data={Object.values(expenseCategories)}
                      maxHeight={300}
                      labelField="label"
                      valueField="value"
                      itemTextStyle={{ color: colors.text }}
                      itemContainerStyle={styles.dropdownItemContainer}
                      containerStyle={[styles.dropdownListContainer, {borderColor: colors.neutral500,shadowColor: colors.black, backgroundColor: colors.neutral900,                      }]}
                      activeColor={colors.primarySelection}
                      value={transaction.category}
                      onChange={(item) => setTransaction({ ...transaction, category: item.value || "" })}
                    />
                  </View>
                )}

                {/* Date Picker */}
                <View style={styles.inputContainer}>
                  <Typo color={colors.neutral200} size={16} fontWeight={"500"} style={{marginBottom: spacingX._10}}>{t("transaction_012")}</Typo>
                  {!showDatePicker && (
                    <Pressable style={[styles.dateInput, {borderColor: colors.neutral300}]} onPress={() => setShowDatePicker(true)}>
                      <Typo size={15} color={colors.text}>{(transaction.date as Date).toLocaleDateString()}</Typo>
                    </Pressable>
                  )}
                  {showDatePicker && (
                    <View style={Platform.OS === 'ios' && styles.iosDatePicker}>
                      <DateTimePicker
                        value={transaction.date as Date}
                        textColor={colors.text}
                        mode="date"
                        display={Platform.OS === 'ios' ? "spinner" : "default"}
                        onChange={onDateChange}
                      />
                      {Platform.OS === 'ios' && (
                        <TouchableOpacity
                          style={[styles.datePickerButton, { backgroundColor: colors.primary}]}
                          onPress={() => setShowDatePicker(false)}
                        >
                          <Typo size={15} fontWeight={"500"} color={colors.neutral900}>{t("transaction_019")}</Typo>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </View>

                {/* Amount */}
                <View style={styles.inputContainer}>
                  <Typo color={colors.neutral200} size={16} fontWeight={"500"} style={{marginBottom: spacingX._10}}>{t("transaction_013")}</Typo>
                  <Input
                    keyboardType='numeric'
                    value={transaction?.amount === 0 ? "" : transaction?.amount.toString()}
                    onChangeText={(value) => {
                      const numericValue = value.replace(/[^0-9]/g, "");
                      setTransaction({ 
                        ...transaction, 
                        amount: numericValue === "" ? 0 : Number(numericValue) 
                      });
                    }}
                  />
                </View>

                {/* Description */}
                <View style={styles.inputContainer}>
                  <View style={styles.flexRow}>
                    <Typo color={colors.neutral200} fontWeight={"500"} size={16}>{t("transaction_014")}</Typo>
                    <Typo color={colors.neutral400} size={14}>{t("transaction_015")}</Typo>
                  </View>
                  <Input
                    value={transaction?.description}
                    multiline
                    containerStyle={styles.descriptionContainer}
                    onChangeText={(value) =>
                      setTransaction({ ...transaction, description: value })
                    }
                  />
                </View>

                {/* Image Upload */}
                <View style={[styles.inputContainer, { marginBottom: spacingY._30 }]}>
                  <View style={styles.flexRow}>
                    <Typo color={colors.neutral200} size={16}>{t("transaction_016")}</Typo>
                    <Typo color={colors.neutral400} size={14}>{t("transaction_015")}</Typo>
                  </View>
                  <ImageUpload
                    file={transaction.image}
                    placeholder="Upload Image"
                    onSelect={(file) => setTransaction({ ...transaction, image: file })}
                    onClear={() => setTransaction({ ...transaction, image: null })}
                  />
                </View>
            </ScrollView>

              {/* Footer */}
              <View style={[styles.footer, { borderTopColor: colors.neutral500}]}>
                {oldTransaction?.id && !loading && (
                  <DeleteButton onPress={deletWalletAlert} style={{ paddingHorizontal: spacingX._15 }}>
                    <Icons.Trash color={colors.screenBackground} size={verticalScale(24)} weight='bold' />
                  </DeleteButton>
                )}
                <Button onPress={onSubmit} loading={loading} style={{ flex: 1 }}>
                  <Typo  color={colors.neutral900} fontWeight={"700"}>
                    {oldTransaction?.id ? t("transaction_017") : t("transaction_018")}
                  </Typo>
                </Button>
              </View>
              
            </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ModalWrapper>
  );
};

export default TransactionModal;

const styles = StyleSheet.create({
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacingX._20,
    gap: scale(20),
    paddingTop: spacingY._15,
    marginBottom: Platform.OS === 'ios' ? spacingY._15 : 0,
    borderTopWidth: 1,
  },
  form: {
    gap: spacingY._30,
    marginTop: spacingY._15
  },
  inputContainer: {
    marginTop: spacingY._20
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._5,
    marginBottom: spacingX._10
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    height: verticalScale(54),
    borderWidth: 1,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15
  },
  iosDatePicker: {},
  datePickerButton: {
    alignSelf: "flex-end",
    padding: spacingY._7,
    marginRight: spacingX._7,
    paddingHorizontal: spacingY._15,
    borderRadius: radius._10,
  },
  dropdownContainer: {
    marginTop: 10,
    height: verticalScale(54),
    borderWidth: 1,
    paddingHorizontal: spacingX._15,
    borderRadius: radius._15,
    borderCurve: "continuous"
  },
  dropdownSelectedText: {
    fontSize: verticalScale(14),
  },
  dropdownListContainer: {
    borderRadius: radius._15,
    borderCurve: "continuous",
    paddingVertical: spacingY._7,
    top: 5,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 5,
  },
  dropdownItemContainer: {
    borderRadius: radius._15,
    marginHorizontal: spacingX._7,
  },
  dropdownIcon: {
    height: verticalScale(30),
  },
  descriptionContainer: {
    flexDirection: "row",
    height: verticalScale(100),
    alignItems: "flex-start",
    paddingVertical: 15
  },
  deleteIcon: {
    paddingHorizontal: spacingX._15
  },
});
