import BackButton from '@/components/BackButton';
import Button from '@/components/Button';
import Header from '@/components/Header';
import ImageUpload from '@/components/ImageUpload';
import Input from '@/components/Input';
import ModalWrapper from '@/components/ModalWrapper';
import Typo from '@/components/Typo';
import { expenseCategories, transactionTypes } from '@/constants/mockData';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { useAuth } from '@/contexts/authContext';
import useFetchData from '@/hooks/useFetchData';
import { createOrUpdateTransaction, deleteTransaction } from '@/services/transactionService';
import { TransactionType, WalletType } from '@/types';
import { scale, verticalScale } from '@/utils/styling';
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from 'expo-router';
import { orderBy, where } from 'firebase/firestore';
import * as Icons from 'phosphor-react-native';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const TransactionModal = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [transaction, setTransaction] = useState<TransactionType>({
    type: 'expense',
    amount: 0,
    description: "",
    category: "",
    date: new Date(),
    walletId: "",
    image: null
  });

  const router = useRouter();

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
    if (!walletId || !date || !amount || (type === "expense" && !category)) {
      Alert.alert("Transaction", "Please fill all the fields");
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
      Alert.alert("Transaction", resp.msg);
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
      Alert.alert("Wallet", res.msg);
    }
  };

  const deletWalletAlert = () => {
    Alert.alert("Confirm", "Delete Transaction\nThis action will remove your transaction from the wallet", [
      { text: "Cancel", style: 'cancel' },
      { text: "Delete", onPress: onTransactionDelete, style: 'destructive' }
    ]);
  };

  return (
    <ModalWrapper>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            <ScrollView
              contentContainerStyle={{ flexGrow: 1, paddingHorizontal: spacingX._20, paddingBottom: 100 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Header
                title={oldTransaction?.id ? "Update Transaction" : "New Transaction"}
                leftIcon={<BackButton />}
                style={{ marginBottom: spacingY._10, marginTop: spacingY._15 }}
              />

              {/* Transaction Type */}
              <View style={styles.inputContainer}>
                <Typo color={colors.neutral200} size={16}>Type</Typo>
                <Dropdown
                  style={styles.dropdownContainer}
                  selectedTextStyle={styles.dropdownSelectedText}
                  iconStyle={styles.dropdownIcon}
                  data={transactionTypes}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  itemTextStyle={styles.dropdownItemText}
                  itemContainerStyle={styles.dropdownItemContainer}
                  containerStyle={styles.dropdownListContainer}
                  activeColor={colors.neutral700}
                  value={transaction.type}
                  onChange={(item) => setTransaction({ ...transaction, type: item.value })}
                />
              </View>

              {/* Wallet */}
              <View style={styles.inputContainer}>
                <Typo color={colors.neutral200} size={16}>Wallet</Typo>
                <Dropdown
                  style={styles.dropdownContainer}
                  placeholder={"Select wallet"}
                  placeholderStyle={{ color: colors.white }}
                  selectedTextStyle={styles.dropdownSelectedText}
                  iconStyle={styles.dropdownIcon}
                  data={wallets.map((wallet) => ({
                    label: `${wallet?.name} ($${wallet.amount})`,
                    value: wallet?.id
                  }))}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  itemTextStyle={styles.dropdownItemText}
                  itemContainerStyle={styles.dropdownItemContainer}
                  containerStyle={styles.dropdownListContainer}
                  activeColor={colors.neutral700}
                  value={transaction.walletId}
                  onChange={(item) => setTransaction({ ...transaction, walletId: item.value || "" })}
                />
              </View>

              {/* Expense Category */}
              {transaction.type === "expense" && (
                <View style={styles.inputContainer}>
                  <Typo color={colors.neutral200} size={16}>Expense Category</Typo>
                  <Dropdown
                    style={styles.dropdownContainer}
                    placeholder={"Select category"}
                    placeholderStyle={{ color: colors.white }}
                    selectedTextStyle={styles.dropdownSelectedText}
                    iconStyle={styles.dropdownIcon}
                    data={Object.values(expenseCategories)}
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    itemTextStyle={styles.dropdownItemText}
                    itemContainerStyle={styles.dropdownItemContainer}
                    containerStyle={styles.dropdownListContainer}
                    activeColor={colors.neutral700}
                    value={transaction.category}
                    onChange={(item) => setTransaction({ ...transaction, category: item.value || "" })}
                  />
                </View>
              )}

              {/* Date Picker */}
              <View style={styles.inputContainer}>
                <Typo color={colors.neutral200} size={16}>Date</Typo>
                {!showDatePicker && (
                  <Pressable style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
                    <Typo size={15}>{(transaction.date as Date).toLocaleDateString()}</Typo>
                  </Pressable>
                )}
                {showDatePicker && (
                  <View style={Platform.OS === 'ios' && styles.iosDatePicker}>
                    <DateTimePicker
                      themeVariant='dark'
                      value={transaction.date as Date}
                      textColor={colors.white}
                      mode="date"
                      display={Platform.OS === 'ios' ? "spinner" : "default"}
                      onChange={onDateChange}
                    />
                    {Platform.OS === 'ios' && (
                      <TouchableOpacity
                        style={styles.datePickerButton}
                        onPress={() => setShowDatePicker(false)}
                      >
                        <Typo size={15} fontWeight={"500"}>Change</Typo>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>

              {/* Amount */}
              <View style={styles.inputContainer}>
                <Typo color={colors.neutral200} size={16}>Amount</Typo>
                <Input
                  keyboardType='numeric'
                  value={transaction?.amount.toString()}
                  onChangeText={(value) =>
                    setTransaction({ ...transaction, amount: Number(value.replace(/[^0-9]/g, "")) })
                  }
                />
              </View>

              {/* Description */}
              <View style={styles.inputContainer}>
                <View style={styles.flexRow}>
                  <Typo color={colors.neutral200} size={16}>Description</Typo>
                  <Typo color={colors.neutral500} size={14}>(optional)</Typo>
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
              <View style={[styles.inputContainer, { marginBottom: 15 }]}>
                <View style={styles.flexRow}>
                  <Typo color={colors.neutral200} size={16}>Receipt</Typo>
                  <Typo color={colors.neutral500} size={14}>(optional)</Typo>
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
            <View style={styles.footer}>
              {oldTransaction?.id && !loading && (
                <Button onPress={deletWalletAlert} style={styles.deleteIcon}>
                  <Icons.Trash color={colors.white} size={verticalScale(24)} weight='bold' />
                </Button>
              )}
              <Button onPress={onSubmit} loading={loading} style={{ flex: 1 }}>
                <Typo  color={colors.neutral900} fontWeight={"700"}>
                  {oldTransaction?.id ? "Update" : "Submit"}
                </Typo>
              </Button>
            </View>
            
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ModalWrapper>
  );
};

export default TransactionModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacingX._20,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacingX._20,
    gap: scale(20),
    paddingTop: spacingY._15,
    borderTopColor: colors.neutral700,
    marginBottom: spacingY._5,
    borderTopWidth: 1,
  },
  inputContainer: {
    gap: spacingY._10,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._5
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    height: verticalScale(54),
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: radius._17,
    borderCurve: "continuous",
    paddingHorizontal: spacingX._15
  },
  iosDatePicker: {},
  datePickerButton: {
    backgroundColor: colors.neutral700,
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
    borderColor: colors.neutral300,
    paddingHorizontal: spacingX._15,
    borderRadius: radius._15,
    borderCurve: "continuous"
  },
  dropdownItemText: { color: colors.white },
  dropdownSelectedText: {
    color: colors.white,
    fontSize: verticalScale(14),
  },
  dropdownListContainer: {
    backgroundColor: colors.neutral900,
    borderRadius: radius._15,
    borderCurve: "continuous",
    paddingVertical: spacingY._7,
    top: 5,
    borderColor: colors.neutral500,
    shadowColor: colors.black,
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
    tintColor: colors.neutral300,
  },
  descriptionContainer: {
    flexDirection: "row",
    height: verticalScale(100),
    alignItems: "flex-start",
    paddingVertical: 15
  },
  deleteIcon: {
    backgroundColor: colors.redClose,
    paddingHorizontal: spacingX._15
  },
});
